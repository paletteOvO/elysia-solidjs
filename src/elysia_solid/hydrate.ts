import { build, defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
// import devtools from 'solid-devtools/vite';
import virtual from "@rollup/plugin-virtual";
import alias from "@rollup/plugin-alias";
import path from "node:path";
import { generateHydrationScript, renderToStringAsync } from "solid-js/web";
import type { JSXElement } from "solid-js";
import { buildConfig } from "./config";

export const hydratePageScript = async (componentPath: string) => {
	const entryScript = hydrationEntryTemplate(componentPath);
	return (
		(await build(
			buildConfig({
				entryScript,
			}),
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		)) as any
	).output[0].code;
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
		<script id="_prop" type="application/json">${JSON.stringify(props)}</script>
		${await renderToStringAsync(() => component(props))}
		<script async src="/_hydrate.js?hash=${hash}" type="application/javascript"></script>
		`,
	);
};

export const hydrationEntryTemplate = (componentPath: string) => `
	import { hydrate } from "solid-js/web";
	import App from "@src/pages/${componentPath}";
	hydrate(
		() => 
			App(JSON.parse(document.getElementById("_prop").innerText)),
	 	document.getElementById("app"));
`;
