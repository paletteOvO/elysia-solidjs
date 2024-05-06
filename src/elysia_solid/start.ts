import type { JSXElement } from "solid-js";
import { hydrate, isServer } from "solid-js/web";

export const entry = <T>(
	children: (props: T) => JSXElement,
): ((props: T) => JSXElement) => {
	if (!isServer) {
		const props = JSON.parse(
			document.getElementById("_prop")?.innerHTML ?? "{}",
		);
		// biome-ignore lint/style/noNonNullAssertion: let it crash
		hydrate(() => children(props), document.getElementById("app")!);
	}
	return children;
};

