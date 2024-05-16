import { A } from "@solidjs/router";
import { createEffect, createSignal } from "solid-js";

export default () => {

	return (
		<div>
			Hello Solid/Elysia
			<A href="/counter">Counter</A>
		</div>
	);
};
