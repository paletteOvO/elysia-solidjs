import crypto from "node:crypto";

import Elysia, { NotFoundError, t } from "elysia";

import { renderPage } from "./hydrate";

import type { JSXElement } from "solid-js";

const _hydrations = new Map<string, string>();

export default <
	const C extends Record<string, (props: any) => JSXElement>,
>(config: {
	components: C;
}) => {
	for (const componentPath in config.components) {
		const md5 = crypto.createHash("md5");
		const hash = md5.update(componentPath).digest("hex");
		if (!_hydrations.has(hash)) {
			_hydrations.set(hash, componentPath);
		}
	}

	return new Elysia()
		.decorate(
			"renderPage",
			<const P extends string>(
				componentPath: P,
				props: Parameters<C[P]>[0],
			) => {
				const component = config.components[componentPath];

				const md5 = crypto.createHash("md5");
				const hash = md5.update(componentPath).digest("hex");

				return renderPage(component, props, hash);
			},
		)
		.get(
			"/_hydrate.js",
			async ({ query: { hash }, set }) => {
				const componentPath = _hydrations.get(hash);
				if (!componentPath) {
					throw new NotFoundError();
				}

				set.headers["content-type"] = "application/javascript; charset=utf8";
				return Bun.file(`${__dirname}/hydrate-pages/${componentPath}.js`);
			},
			{
				query: t.Object({
					hash: t.String(),
				}),
			},
		);
};
