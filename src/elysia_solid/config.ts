import alias from "@rollup/plugin-alias";
import path from "node:path";
import virtual from "@rollup/plugin-virtual";
import type { ModuleFormat } from "bun";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export const buildConfig = ({
	entryScript,
	entryPath,
	format,
	ssr,
}: {
	ssr?: boolean;
	entryScript?: string;
	entryPath?: string;
	format?: ModuleFormat;
}) => {
	return defineConfig({
		build: {
			ssr: ssr ?? false,
			emptyOutDir: false,
			target: "esnext",
			rollupOptions: {
				input: entryPath ?? "entry",
				output: {
					dir: "dist",
					format: format ?? "iife",
					entryFileNames: "[hash].js",
				},
				plugins: entryScript
					? [
							virtual({
								entry: entryScript,
							}),
							alias({
								entries: [
									{ find: "@src", replacement: path.join(__dirname, "src") },
								],
							}),
						]
					: [
							alias({
								entries: [
									{ find: "@src", replacement: path.join(__dirname, "src") },
								],
							}),
						],
			},
		},
		plugins: [
			/* 
			Uncomment the following line to enable solid-devtools.
			For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
			*/
			// devtools(),
			solidPlugin({
				ssr: true,
			}),
		],
	});
};
