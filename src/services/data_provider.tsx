import { type JSXElement, createContext } from "solid-js";
import { isServer } from "solid-js/web";

import useDataClient from "@src/services/data.client";
import useDataServer from "@src/services/data.server";

const useData = isServer ? useDataServer : useDataClient;

export const DataContext = createContext({
	useData,
});

export const DataProvider = (props: { children: JSXElement }) => {
	return (
		<DataContext.Provider value={{ useData }}>
			{props.children}
		</DataContext.Provider>
	);
};
