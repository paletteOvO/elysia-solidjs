import { Elysia } from "elysia";

import elysiaSolid from "./elysia_solid";

import IndexPage from "./pages/index";

const app = new Elysia()
	.use(
		elysiaSolid({
			components: {
				index: IndexPage,
			},
		}),
	)
	.get("/", ({ renderPage, set }) => {
		set.headers["content-type"] = "text/html; charset=utf8";
		return renderPage("index", {
			counter: 42,
		});
	})
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
