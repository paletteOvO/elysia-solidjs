import crypto from "node:crypto";

import Elysia, { NotFoundError, t } from "elysia";

import { hydrateScript, renderPage } from "./hydrate";

import type { JSXElement } from "solid-js";

const _hydrations = new Map<string, Promise<string>>();

export default <const C extends Record<string, (props: any) => JSXElement>>(config: {
  components: C;
}) => {

  for (const componentPath in config.components) {
    const md5 = crypto.createHash("md5");
    const hash = md5.update(componentPath).digest("hex");
    if (!_hydrations.has(hash)) {
      _hydrations.set(hash, hydrateScript(componentPath));
    }
  }

  return new Elysia()
    .decorate("renderPage", <const P extends string>(
      componentPath: P, props: Parameters<C[P]>[0]) => {

      const component = config.components[componentPath];

      const md5 = crypto.createHash("md5");
      const hash = md5.update(componentPath).digest("hex");

      return renderPage(component, props, hash);
    })
    .get(
      "/_hydrate.js",
      async ({ query: { hash }, set }) => {
        const hydrationScript = _hydrations.get(hash);
        if (!hydrationScript) {
          throw new NotFoundError();
        }

        set.headers["content-type"] = "application/javascript; charset=utf8";
        return await Bun.file(await hydrationScript).text();
      },
      {
        query: t.Object({
          hash: t.String(),
        })
      },
    );
}
