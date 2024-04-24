import { Elysia } from "elysia";

import { staticPlugin } from "@elysiajs/static";

import elysia_solid from "./elysia_solid";

const app = new Elysia()
	.use(
		staticPlugin({
			prefix: "/public",
			assets: "public",
			alwaysStatic: true,
		}),
	)
	.use(
		elysia_solid({
			prefix: "/",
			component: (await import("@src/components/App")).default,
			componentPath: "@src/components/App",
		}),
	)
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
