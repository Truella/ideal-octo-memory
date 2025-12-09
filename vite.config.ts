import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: "./src/loader.ts", 
			name: "TourWidget",
			fileName: "tour",
			formats: ["iife"],
		},
		rollupOptions: {
			output: {
				entryFileNames: "tour.js",
				assetFileNames: "tour.[ext]",
			},
		},
		minify: "terser",
	},
});
