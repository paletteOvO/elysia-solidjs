import crypto from "node:crypto";

import Elysia, { NotFoundError, t } from "elysia";

import { hydratePageScript, renderPage } from "./hydrate";
import type { JSXElement } from "solid-js";
import { build } from "vite";
import { buildConfig } from "./config";

const _hydrations = new Map<string, Promise<string>>();
const _components = new Map<string, (props: unknown) => JSXElement>();

const buildComponent = async (
	componentPath: string,
): Promise<(props: unknown) => JSXElement> => {
	const path = (
		(await build(
			buildConfig({
				entryPath: `./src/pages/${componentPath}.tsx`,
				format: "esm",
				ssr: true,
			}),
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		)) as any
	).output[0].fileName;
	return (await import(`./${path}`)).default;
};

export default new Elysia()
	.decorate("renderPage", async <S>(componentPath: string, props: S) => {
		const md5 = crypto.createHash("md5");
		const hash = md5.update(componentPath).digest("hex");

		// cache the server side component
		if (!_components.has(hash)) {
			_components.set(hash, await buildComponent(componentPath));
		}

		const component = _components.get(hash) as (props: S) => JSXElement;

		// cache the client side hydrate script for /_hydrate.js
		if (!_hydrations.has(hash)) {
			_hydrations.set(hash, hydratePageScript(componentPath));
		}

		return await renderPage(component, props, hash);
	})
	.get(
		"/_hydrate.js",
		async ({ query: { hash } }) => {
			const hydrationScript = _hydrations.get(hash);
			if (!hydrationScript) {
				throw new NotFoundError();
			}
			return await Bun.file(await hydrationScript).text();
		},
		{
			query: t.Object({
				hash: t.String(),
			}),
			afterHandle: async ({ set }) => {
				set.headers["content-type"] = "application/javascript; charset=utf8";
			},
		},
	);
