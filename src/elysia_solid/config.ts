import virtual from "@rollup/plugin-virtual";
import type { ModuleFormat } from "bun";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export const buildConfig = ({
	entryScript,
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
				preserveEntrySignatures: "exports-only",
				output: {
					paths: (id): string => {
						console.log(id)
						return `/_hydrate/${id}`;
					},
					preserveModules: true,
					dir: "dist/_hydrate/",
					format: "esm",
					entryFileNames: "chunked-[hash].js",
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
