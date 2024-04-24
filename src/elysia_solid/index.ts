import crypto from "node:crypto";

import Elysia, { NotFoundError, t } from "elysia";

import { hydratePageScript, renderPage } from "./hydrate";
import type { JSXElement } from "solid-js";

const _hydration_script = new Map<string, Promise<string>>();

export default new Elysia()
	.decorate(
		"renderPage",
		async <S>(
			componentPath: string,
			component: (props: S) => JSXElement,
			props: S
		) => {
			const md5 = crypto.createHash("md5");
			const hash = md5.update(componentPath).digest("hex");
			// cache the script for /_hydrate.js
			if (!_hydration_script.has(hash)) {
				_hydration_script.set(hash, hydratePageScript(componentPath));
			}
			return await renderPage(component, props, hash);
		},
	)
	.get(
		"/_hydrate.js",
		async ({ query: { hash } }) => {
			const hydrationScript = _hydration_script.get(hash);
			if (!hydrationScript) {
				throw new NotFoundError();
			}
			return await hydrationScript;
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
