import { Elysia, t } from "elysia";

import solid from "./elysia_solid";
import { treaty } from "@elysiajs/eden";

export const app = new Elysia()
	.use(
		solid({
			prefix: "/",
			router: ["/", "/counter"],
		}),
	)
	.get("/api/hello", ({ set }) => {
		set.headers["content-type"] = "application/json";
		return {
			message: "Hello from Elysia!",
		};
	})
	.listen(3000);

export type App = typeof app;

export const eden = treaty<App>(app);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
