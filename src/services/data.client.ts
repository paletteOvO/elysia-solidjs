import { isServer } from "solid-js/web";

export default async <T>(path: string): Promise<T> => {
	console.assert(!isServer && window !== undefined);
	const response = await fetch(new Request(path));
	return await response.json();
};
