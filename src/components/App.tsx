import { A } from "@solidjs/router";
import { DataContext } from "@src/services/data_provider";
import { Show, createResource, useContext } from "solid-js";

export default () => {
	const { useData } = useContext(DataContext);
	const [data] = createResource(() =>
		useData<{ message: string }>("/api/hello"),
	);

	return (
		<div>
			Hello Solid/Elysia
			<Show when={data() !== undefined}>{data().message}</Show>
			<A href="/counter">Counter</A>
		</div>
	);
};
