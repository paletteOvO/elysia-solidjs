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
					preserveModules: true,
					dir: "dist/_hydrate/",
					format: "esm",
					entryFileNames: "chunked-[hash].js",
				},
				plugins: [
					virtual({
						entry: entryScript,
					}),
					virtual({
						"@void": "export default undefined",
					}),
					{
						name: "replace-import",
						transform(code, id) {
							return {
								code: code.replace(
									/import (.*?) from ".*?.server"/g,
									'import $1 from "@void"',
								),
								map: null,
							};
						},
					},
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
