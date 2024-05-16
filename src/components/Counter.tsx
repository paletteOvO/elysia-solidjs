import { A } from "@solidjs/router";
import { createSignal } from "solid-js";

export default () => {
   const [count, set_count] = createSignal(0);
	return (
		<div>
			{count()}
         <button onClick={() => set_count(count() + 1)}>Increment</button>
			<A href="/">Home</A>
		</div>
	);
};
