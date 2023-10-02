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
		server: {
			deps: {
				inline: [/solid-js/],
				// registerNodeLoader: false,
			},
		},
		environment: "happy-dom",
		restoreMocks: true,
		testTransformMode: { web: ["/.[jt]sx?$/"] },
	},
});
