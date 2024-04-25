import { build } from "vite";
import { renderToStringAsync } from "solid-js/web";
import type { JSXElement } from "solid-js";
import { buildConfig } from "./config";
import entry from "@src/pages/entry";
import { MetaProvider } from "@solidjs/meta";

export const hydrateScript = async (componentPath: string): Promise<string> => {

	const entryScript = `
		import { hydrate } from "solid-js/web";
		import App from "@src/pages/${componentPath}";
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

export const renderPage = async <S>(
	component: (props: S) => JSXElement,
	props: S,
	hash: string,
) => {
	return entry({
		children: await renderToStringAsync(() => component(props)),
		scripts: `
		<script id="_prop" type="application/json">${JSON.stringify(props)}</script>
		<script async src="/_hydrate.js?hash=${hash}" type="application/javascript"></script>`,
	});
};
