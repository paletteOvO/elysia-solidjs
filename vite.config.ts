import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
// import devtools from 'solid-devtools/vite';
import path from "node:path";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
	build: {
		ssr: true,
		emptyOutDir: true,
		target: "esnext",
		rollupOptions: {
			input: path.join(__dirname, "src/index.ts"),
			plugins: [typescript()],
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
