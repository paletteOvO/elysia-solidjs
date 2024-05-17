import { eden } from "@src/index";
import { isServer } from "solid-js/web";

export default () => (isServer ? eden : undefined);
