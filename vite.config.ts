import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
// import devtools from 'solid-devtools/vite';
import path from "node:path";
import alias from "@rollup/plugin-alias";

export default defineConfig({
	build: {
		ssr: true,
		emptyOutDir: true,
		target: "esnext",
		rollupOptions: {
			input: path.join(__dirname, "src/index.ts"),
			plugins: [
				alias({
					entries: [{ find: "@src", replacement: path.join(__dirname, "src") }],
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
