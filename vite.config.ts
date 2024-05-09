import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import path from "node:path";

export default defineConfig({
	build: {
		ssr: path.join(__dirname, "src/index.ts"),
		emptyOutDir: true,
		target: "esnext",
		rollupOptions: {
			plugins: [],
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
