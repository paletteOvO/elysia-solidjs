import { A, createAsync } from "@solidjs/router";
import { useEden } from "@src/services/eden";
import { Show } from "solid-js";

import styles from "./App.module.css";

export default () => {
	const eden = useEden();
	const data = createAsync(async () => (await eden.api.hello.get()).data);

	return (
		<div classList={{
			[styles.App]: true,
		}}>
			Hello Solid/Elysia
			<Show when={data() !== undefined}>{data()?.message}</Show>
			<A href="/counter">Counter</A>
		</div>
	);
};
