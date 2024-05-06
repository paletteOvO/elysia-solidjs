import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { globSync } from "glob";
import path from "node:path";
import { fileURLToPath } from "node:url";

export default defineConfig({
	build: {
		ssr: false,
		emptyOutDir: true,
		rollupOptions: {
			input: Object.fromEntries(
				globSync("src/pages/*.tsx").map((file) => [
					path.relative(
						"src",
						file.slice(0, file.length - path.extname(file).length),
					),
					fileURLToPath(new URL(file, import.meta.url)),
				]),
			),
			output: {
				dir: "dist",
				format: "iife",
				entryFileNames: "hydrate-[name].js",
			},
			plugins: [],
		},
	},
	plugins: [
		solidPlugin({
			ssr: true,
		}),
	],
});
