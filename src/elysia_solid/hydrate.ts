import { build } from "vite";
import { renderToString } from "solid-js/web";
import type { JSXElement } from "solid-js";
import { buildConfig } from "./config";
import entry from "../pages/entry";

export const hydrateScript = async (componentPath: string): Promise<string> => {
	const entryScript = `
		import { hydrate } from "solid-js/web";
		import App from "${componentPath}";
		hydrate(
			() => 
				App(JSON.parse(document.getElementById("_prop").innerText)),
			document.getElementById("app"));
	`;

	return `./dist/${
		(
			(await build(
				buildConfig({
					entryScript,
				}),
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			)) as any
		).output[0].fileName
	}`;
};

export const renderPage = <S>(
	component: (props: S) => JSXElement,
	props: S,
	hash: string,
) => {
	return entry({
		children: renderToString(() => component(props)),
		scripts: `
		<script id="_prop" type="application/json">${JSON.stringify(props)}</script>
		<script async src="/_hydrate.js?hash=${hash}" type="module"></script>`,
	});
};
