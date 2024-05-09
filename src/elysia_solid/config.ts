import virtual from "@rollup/plugin-virtual";
import type { ModuleFormat } from "bun";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export const buildConfig = ({
	entryScript,
	format,
}: {
	entryScript: string;
	format?: ModuleFormat;
}) => {
	return defineConfig({
		build: {
			ssr: false,
			emptyOutDir: false,
			rollupOptions: {
				input: "entry",
				output: {
					dir: "dist",
					format: format ?? "iife",
					entryFileNames: "[hash].js",
				},
				plugins: [
					virtual({
						entry: entryScript,
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
