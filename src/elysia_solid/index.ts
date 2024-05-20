import crypto from "node:crypto";

import Elysia, { NotFoundError, t } from "elysia";

import entry from "@src/pages/entry";
import index from "@src/pages/index";
import {
	generateHydrationScript,
	getAssets,
	renderToStringAsync,
} from "solid-js/web";

export const client_manifest = async (): Promise<{
	entry_script: [string, string][];
	entry_style: [string, string][];
	lazy_script: [string, string][];
	lazy_style: [string, string][];
}> => {
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
			isEntry?: boolean;
			dynamicImports: string[];
			css?: string[];
		}
	>;
	const entry_script = Object.values(manifest)
		.filter((x) => x.isEntry === true)
		.map(async (x) => {
			return [x.file, await Bun.file(`./dist/_hydrate/${x.file}`).text()] as [
				string,
				string,
			];
		});
	const entry_style = Object.values(manifest)
		.filter((x) => x.isEntry === true)
		.flatMap((x) => x.css ?? [])
		.map(async (x) => {
			return [x, await Bun.file(`./dist/_hydrate/${x}`).text()] as [
				string,
				string,
			];
		});
	const lazy_script = Object.values(manifest)
		.filter((x) => x.isEntry !== true)
		.map(async (x) => {
			return [x.file, await Bun.file(`./dist/_hydrate/${x.file}`).text()] as [
				string,
				string,
			];
		});
	const lazy_assets = Object.values(manifest)
		.flatMap((x) => x.css ?? [])
		.map(async (x) => {
			return [x, await Bun.file(`./dist/_hydrate/${x}`).text()] as [
				string,
				string,
			];
		});
	return {
		entry_script: await Promise.all(entry_script),
		entry_style: await Promise.all(entry_style),
		lazy_script: await Promise.all(lazy_script),
		lazy_style: await Promise.all(lazy_assets),
	};
};

export default async <const P extends string>({
	prefix,
	router,
}: {
	prefix: P;
	router: string[];
}) => {
	const manifest = await client_manifest();

	const app = new Elysia({ prefix: prefix === "/" ? "" : prefix }).decorate(
		"render",
		async (url: string) => {
			const stylesheet = manifest.entry_style.map(x => x[1]).join("")
			return entry({
				children: await renderToStringAsync(() => index({ url }), {}),
				scripts: `<script async src="/_hydrate/${manifest.entry_script[0][0]}" type="module"></script>`,
				assets: `<style>${stylesheet}</style>${getAssets()}${generateHydrationScript()}`,
			});
		},
	);

	for (const route of router) {
		app.get(route, ({ render, request, set }) => {
			set.headers["content-type"] = "text/html";
			return render(request.url);
		});
	}

	for (const [path, code] of manifest.entry_script) {
		app.get(`/_hydrate/${path}`, async ({ set }) => {
			set.headers["content-type"] = "application/javascript; charset=utf8";
			return code;
		});
	}

	for (const [path, code] of manifest.lazy_script) {
		app.get(`/_hydrate/${path}`, async ({ set }) => {
			set.headers["content-type"] = "application/javascript; charset=utf8";
			return code;
		});
	}

	for (const [path, code] of manifest.lazy_style) {
		app.get(`/${path}`, async ({ set }) => {
			set.headers["content-type"] = "text/css; charset=utf8";
			return code;
		});
	}

	return app;
};
