import { A } from "@solidjs/router";
import { EdenContext } from "@src/services/eden_provider";
import { Show, createResource, useContext } from "solid-js";

export default () => {
	const { eden } = useContext(EdenContext);
	const [data] = createResource(async () => (await eden.api.hello.get()).data);

	return (
		<div>
			Hello Solid/Elysia
			<Show when={data() !== undefined}>{data()?.message}</Show>
			<A href="/counter">Counter</A>
		</div>
	);
};
