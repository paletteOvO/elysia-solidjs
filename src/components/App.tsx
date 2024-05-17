import { A, createAsync } from "@solidjs/router";
import { eden } from "@src/services/eden";
import { Show } from "solid-js";

export default () => {
	const data = createAsync(async () => (await eden().api.hello.get()).data);

	return (
		<div>
			Hello Solid/Elysia
			<Show when={data() !== undefined}>{data()?.message}</Show>
			<A href="/counter">Counter</A>
		</div>
	);
};
