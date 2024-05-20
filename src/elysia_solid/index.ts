import crypto from "node:crypto";

import Elysia, { NotFoundError, t } from "elysia";

import entry from "@src/pages/entry";
import index from "@src/pages/index";
import {
	generateHydrationScript,
	getAssets,
	renderToStringAsync,
} from "solid-js/web";

export const hydrateScript = async (): Promise<(readonly [string, string])[]> => {
	const manifest = (await Bun.file(
		"./dist/_hydrate/.vite/manifest.json",
	).json()) as Record<
		string,
		{
			file: string;
			name: string;
			src: string;
			isDynamicEntry?: boolean;
			imports: string[];
			isEntry?: boolean,
			dynamicImports: string[]
		}
	>;
	const entry = Object.values(manifest).filter((x) => x.isEntry === true)
	const lazy_script = Object.values(manifest).filter((x) => x.isEntry !== true)
	const css_assets = Object.values(manifest).filter((x) => x.file.endsWith(".css"))
	const ret = await Promise.all([
		...entry,
		...lazy_script,
		...css_assets
	].map(async (x) => {
		return [
			x.file,
			await Bun.file(`./dist/_hydrate/${x.file}`).text()
		] as const
	}))

	return ret;
};

export default async <const P extends string>({
	prefix,
	router,
}: {
	prefix: P;
	router: string[];
}) => {
	const _hydrate_scripts = await hydrateScript();

	const app = new Elysia({ prefix: prefix === "/" ? "" : prefix })
		.decorate("render", async (url: string) => {
			const entryScript = _hydrate_scripts[0];

			return entry({
				children: await renderToStringAsync(() => index({ url }), {}),
				scripts: `<script async src="/_hydrate/${entryScript[0]}" type="module"></script>`,
				assets: `${getAssets()}${generateHydrationScript()}`,
			});
		});

	for (const route of router) {
		app.get(route, ({ render, request, set }) => {
			set.headers["content-type"] = "text/html";
			return render(request.url);
		});
	}

	for (const [path, code] of _hydrate_scripts) {
		app.get(`/_hydrate/${path}`, async ({ set }) => {
			set.headers["content-type"] = "application/javascript; charset=utf8";
			return code;
		});
	}

	return app;
};
