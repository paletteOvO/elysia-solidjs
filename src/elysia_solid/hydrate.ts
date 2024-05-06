import { renderToString } from "solid-js/web";
import type { JSXElement } from "solid-js";
import entry from "../entry";

export const renderPage = <S>(
	component: (props: S) => JSXElement,
	props: S,
	hash: string,
) => {
	return entry({
		head: `
		<script id="_prop" type="application/json">${JSON.stringify(props)}</script>
		<script defer src="/_hydrate.js?hash=${hash}" type="module"></script>`,
		children: renderToString(() => component(props)),
	});
};
