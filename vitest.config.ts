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
		testTransformMode: {
			web: ["/.[jt]sx?$/"],
		},
		server: {
			deps: {
				inline: [/solid-js/, /solid-testing-library/],
			},
		},
		environment: "happy-dom",
		restoreMocks: true,
		globals: true,
		coverage: {
			enabled: true,
			all: true,
			provider: "v8",
			include: ["src/**/*.ts"],
			exclude: ["src/**/*.types.ts"],
			reporter: ["html", "text-summary", "lcovonly"],
		},
		typecheck: {
			enabled: true,
		},
	},
});
