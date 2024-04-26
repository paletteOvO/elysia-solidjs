import crypto from "node:crypto";

import Elysia, { NotFoundError, t } from "elysia";

import { hydrateScript, renderPage } from "./hydrate";
import type { JSXElement } from "solid-js";

const _hydrations = new Map<string, Promise<string>>();

export default new Elysia()
  .decorate("renderPage", async<P>(
    component: Promise<{ "default": (props: P) => JSXElement }>,
    componentPath: string, props: P) => {
    const md5 = crypto.createHash("md5");
    const hash = md5.update(componentPath).digest("hex");

    // cache the client side hydrate script for /_hydrate.js
    if (!_hydrations.has(hash)) {
      _hydrations.set(hash, hydrateScript(componentPath));
    }

    return await renderPage((await component).default, props, hash);
  })
  .get(
    "/_hydrate.js",
    async ({ query: { hash } }) => {
      const hydrationScript = _hydrations.get(hash);
      if (!hydrationScript) {
        throw new NotFoundError();
      }
      return await Bun.file(await hydrationScript).text();
    },
    {
      query: t.Object({
        hash: t.String(),
      }),
      afterHandle: async ({ set }) => {
        set.headers["content-type"] = "application/javascript; charset=utf8";
      },
    },
  );
