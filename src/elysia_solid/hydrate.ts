import { build, defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
// import devtools from 'solid-devtools/vite';
import virtual from "@rollup/plugin-virtual";
import alias from "@rollup/plugin-alias";
import path from "node:path";
import { generateHydrationScript, renderToStringAsync } from "solid-js/web";
import type { JSXElement } from "solid-js";

export const hydratePageScript = async (componentPath: string) => {
	const hydrationScript =
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		((await build(hydrationConfig(componentPath))) as any).output[0].code;
	return hydrationScript;
};

export const renderPage = async <S>(
	component: (context?: S) => JSXElement,
	context: S,
) => {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const ctx = context as any;
	const basePath = ctx.path.endsWith("/") ? ctx.path : `${ctx.path}/`;
	return `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<title>🔥 Solid SSR 🔥</title>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link rel="stylesheet" href="/styles.css" />
		<base href="${basePath}" target="_self">
		${generateHydrationScript()}
	</head>
	<body>${await renderToStringAsync(() => component(context))}</body>
	<script async src="_hydrate.js" ></script>
	</html>
`;
};

export const hydrationEntryTemplate = (componentPath: string) => `
    import { hydrate } from "solid-js/web";
    import App from "${componentPath}";
    hydrate(() => App(), document);
`;

export const hydrationConfig = (componentPath: string) => {
	return defineConfig({
		build: {
			ssr: false,
			emptyOutDir: false,
			target: "esnext",
			rollupOptions: {
				input: "entry",
				output: {
					dir: "dist",
					format: "iife",
				},
				plugins: [
					virtual({
						entry: hydrationEntryTemplate(componentPath),
					}),
				],
			},
		},
		plugins: [
			/* 
                Uncomment the following line to enable solid-devtools.
                For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
                */
			// devtools(),
			solidPlugin({
				ssr: true,
			}),
		],
	});
};
