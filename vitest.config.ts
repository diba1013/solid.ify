import solid from "vite-plugin-solid";
import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: {
			"@": "/src",
		},
	},
	build: {
		target: "esnext",
	},
	plugins: [solid()],
	test: {
		testTransformMode: { web: ["/.[jt]sx?$/"] },
		server: {
			deps: {
				inline: [/solid-js/],
				// registerNodeLoader: false,
			},
		},
		environment: "happy-dom",
		restoreMocks: true,
		coverage: {
			all: true,
			provider: "v8",
			include: ["src/**/*.ts"],
			exclude: ["src/**/*.types.ts"],
			reporter: ["html", "text-summary", "lcovonly"],
		},
	},
});
