import { createEffect, createSignal } from "solid-js"


const Counter = () => {
    const [count, setCount] = createSignal(1);
    const increment = () => setCount(count => count + 1);

    return (
        <button type="button" onClick={increment}>
            {count()}
        </button>
    );
}

export default () => {
    createEffect(() => {
        console.log("Hi")
    })
    return <div>
        Hello Solid/Elysia
        <Counter />
    </div>
}