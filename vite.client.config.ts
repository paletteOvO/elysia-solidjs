import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

import virtual from "@rollup/plugin-virtual";

export default defineConfig({
	resolve: {
		alias: {
			"@src": `${__dirname}/src`,
		},
	},
	build: {
		ssr: false,
		emptyOutDir: true,
		manifest: true,
		assetsDir: ".",
		copyPublicDir: false,
		modulePreload: false,
		rollupOptions: {
			input: "./src/elysia_solid/entry-client.ts",
			output: {
				dir: "dist/_hydrate/",
				format: "esm",
				chunkFileNames: "chunked-[hash].js",
				entryFileNames: "entry-[hash].js",
			},
			plugins: [
				virtual({
					"@void": "export default undefined",
				}),
				{
					name: "replace-import",
					transform(code: string, _id: string) {
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
		// devtools(),
		solidPlugin({
			ssr: true,
		}),
	],
});
