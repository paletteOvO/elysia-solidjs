import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
	build: {
		ssr: "src/index.ts",
		emptyOutDir: false,
		target: "esnext",
		rollupOptions: {
			plugins: [],
		},
	},
	plugins: [
		solidPlugin({
			ssr: true,
		}),
	],
});
