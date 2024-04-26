import { createEffect, createSignal } from "solid-js";

export default (props: {
	counter: number;
}) => {
	const [count, setCount] = createSignal(props.counter);
	const increment = () => setCount((count) => count + 1);

	createEffect(() => {
		console.log("Hi");
	});

	return (
		<div>
			Hello Solid/Elysia
			<button type="button" onClick={increment}>
				{count()}
			</button>
		</div>
	);
};
