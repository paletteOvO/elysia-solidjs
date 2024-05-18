import { isServer } from "solid-js/web";

import edenClient from "@src/services/eden.client";
import edenServer from "@src/services/eden.server";

export const useEden = () => (isServer ? edenServer : edenClient)()!;
