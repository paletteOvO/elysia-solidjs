import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
	resolve: {
		alias: {
			"@src": `${__dirname}/src`,
		},
	},
	build: {
		ssr: true,
		rollupOptions: {
			input: "src/index.ts",
			output: {
				dir: "dist/server/",
			},
		},
		emptyOutDir: true,
		target: "esnext",
		modulePreload: false,
	},
	plugins: [
		// devtools(),
		solidPlugin({
			ssr: true,
		}),
	],
});
