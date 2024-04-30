import { Elysia } from "elysia";

import elysiaSolid from "./elysia_solid";

const app = new Elysia()
  .use(elysiaSolid({
    components: {
      "@src/pages/index": (await import("@src/pages/index")).default,
    },
  }))
  .get(
    "/",
    async ({ renderPage }) => {
      return await renderPage(
        "@src/pages/index",
        {
          counter: 42,
        })
    },
    {
      afterHandle: async ({ set }) => {
        set.headers["content-type"] = "text/html; charset=utf8";
      },
    },
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
