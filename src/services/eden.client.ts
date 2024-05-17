import { treaty } from "@elysiajs/eden";
import type { App } from "@src/index";
import { isServer } from "solid-js/web";

export default () => isServer ? undefined : treaty<App>(window.location.origin);
