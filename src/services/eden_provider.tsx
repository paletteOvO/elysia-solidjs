import { type JSXElement, createContext } from "solid-js";
import { isServer } from "solid-js/web";

import edenClient from "@src/services/eden.client";
import edenServer from "@src/services/eden.server";

const eden = isServer ? edenServer : edenClient;

export const EdenContext = createContext(
	{} as { eden: NonNullable<ReturnType<typeof eden>> },
);

export const EdenProvider = (props: { children: JSXElement }) => {
	return (
		<EdenContext.Provider
			value={{
				eden: eden()!,
			}}
		>
			{props.children}
		</EdenContext.Provider>
	);
};
