import { Elysia } from "elysia";

import solid from "./elysia_solid";

const app = new Elysia()
	.use(
		solid({
			prefix: "/",
			router: [
				"/",
				"/counter",
			]
		}),
	)
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
