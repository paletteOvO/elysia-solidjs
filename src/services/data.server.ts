import { app } from "@src/index";
import { isServer } from "solid-js/web";

export default async <T>(path: string): Promise<T> => {
	console.assert(isServer);
	const response = await app.handle(
		new Request(`${app.server?.hostname}:${app.server?.port}${path}`),
	);
	return await response.json();
};
