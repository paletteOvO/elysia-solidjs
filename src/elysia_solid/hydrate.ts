import { build, defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
// import devtools from 'solid-devtools/vite';
import virtual from "@rollup/plugin-virtual";
import alias from "@rollup/plugin-alias";
import path from "node:path";
import { generateHydrationScript, renderToStringAsync } from "solid-js/web";
import type { JSXElement } from "solid-js";

export const hydratePageScript = async (componentPath: string) => {
	const entryScript = hydrationEntryTemplate(componentPath);
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return ((await build(hydrationConfig(entryScript))) as any).output[0].code;
};

export const renderPage = async <S>(
	component: (props: S) => JSXElement,
	props: S,
	hash: string,
) => {
	const path = "./index.html";
	const file = Bun.file(path);
	const text = await file.text();
	return text.replace(
		"<!-- app -->",
		`
		${generateHydrationScript()}
		${await renderToStringAsync(() => component(props))}
		<script id="_prop" type="application/json">${JSON.stringify(props)}</script>
		<script async src="/_hydrate.js?hash=${hash}" type="application/javascript"></script>
		`,
	);
};

export const hydrationEntryTemplate = (componentPath: string) => `
    import { hydrate } from "solid-js/web";
    import App from "${componentPath}";
    hydrate(() => App(JSON.parse(document.querySelector("script#_prop").innerText)), document.getElementById("app"));
`;

export const hydrationConfig = (entryScript: string) => {
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
						entry: entryScript,
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
