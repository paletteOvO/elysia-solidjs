import { hydrate } from "solid-js/web";
import index from "@src/pages/index";
hydrate(() => index(), document.getElementById("app")!);
