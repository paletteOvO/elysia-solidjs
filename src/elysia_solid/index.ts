import crypto from "node:crypto";

import Elysia, { NotFoundError, t } from "elysia";

import entry from "@src/pages/entry";
import index from "@src/pages/index";
import {
	generateHydrationScript,
	getAssets,
	renderToStringAsync,
} from "solid-js/web";

import { build } from "vite";
import { buildConfig } from "./config";

export const hydrateScript = async (
	url: string,
): Promise<[string, string][]> => {
	return (
		(await build(
			buildConfig({
				entryScript: `
import { hydrate } from "solid-js/web";
import index from "@src/pages/index";

hydrate(() => index({ url: "${url}" }), document.getElementById("app"));
`,
			}),
		)) as any
	).output.map((x: any) => {
		return [x.fileName as string, x.source ?? (x.code as string)];
	});
};

export default <const P extends string>({
	prefix,
	router,
}: {
	prefix: P;
	router: string[];
}) => {
	const _entry_scripts = new Map<string, string>();
	const _hydrate_scripts = new Map<string, string>();

	const app = new Elysia({ prefix: prefix === "/" ? "" : prefix })
		.decorate("render", async (url: string) => {
			const md5 = crypto.createHash("md5");
			const hash = md5.update(url).digest("hex");
			if (!_entry_scripts.has(hash)) {
				const scripts = await hydrateScript(url);
				_entry_scripts.set(hash, scripts[0][0]);
				scripts.forEach(([filename, source]) => {
					_hydrate_scripts.set(filename, source);
				});
			}

			const entryScript = _entry_scripts.get(hash);
			return entry({
				children: await renderToStringAsync(() => index({ url }), {
					// not sure if the script is needed, just delete it when neccessary
					// @ts-ignore
					noScripts: true,
				}),
				scripts: `<script async src="/_hydrate/${entryScript}" type="module"></script>`,
				assets: `${getAssets()}${generateHydrationScript()}`,
			});
		})
		.get("/_hydrate/:name", async ({ params: { name }, set }) => {
			const hydrationScript = _hydrate_scripts.get(name);
			if (!hydrationScript) {
				throw new NotFoundError();
			}

			set.headers["content-type"] = "application/javascript; charset=utf8";
			return hydrationScript;
		});

	for (const route of router) {
		app.get(route, ({ render, request, set }) => {
			set.headers["content-type"] = "text/html";
			return render(request.url);
		});
	}

	return app;
};
