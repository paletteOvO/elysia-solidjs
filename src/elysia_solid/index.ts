import Elysia from "elysia";

import App from "@src/components/App";

import { hydratePageScript, renderPage } from "./hydrate";
import type { JSXElement } from "solid-js";

export default async (route: {
	prefix: string;
	componentPath: string;
	component: (state?: unknown) => JSXElement;
}) => {
	const prefix = route.prefix === "/" ? "" : route.prefix;
	const hydrate_js = await hydratePageScript(route.componentPath);

	return new Elysia().group(prefix, (app) =>
		app
			.get(
				"/",
				async (context) =>
					await renderPage(route.component, context),
				{
					afterHandle({ response, set }) {
						set.headers["content-type"] = "text/html; charset=utf8";
					},
				},
			)
			.get("/_hydrate.js", () => hydrate_js),
	);
};
