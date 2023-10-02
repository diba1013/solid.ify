import { wrap } from "@/signal";
import { Stores, defineStore } from "@/store";
import { cleanup, render } from "@solidjs/testing-library";
import { Component } from "solid-js";
import { afterEach, describe, expect, it } from "vitest";

const useStore = defineStore("test", () => {
	const text = wrap({
		value: "World",
	});

	return {
		text,
		greeting: wrap({
			get: () => {
				return `Hello ${text.get()}!`;
			},
		}),

		change(name: string) {
			text.set(name);
		},
	};
});

const App: Component = () => {
	const cut = useStore();

	return (
		<>
			<div data-testid="test" onClick={() => cut.change("John")}>
				{cut.greeting}
			</div>
		</>
	);
};

const Root: Component = () => {
	// Dummy service object for now
	const services = {};

	return (
		<Stores.Provider value={{ context: services }}>
			<App />
		</Stores.Provider>
	);
};

describe("components", () => {
	afterEach(cleanup);

	it("test", () => {
		const app = render(() => <Root />);

		const button = app.getByTestId("test");

		expect(button.textContent).to.eq("Hello World!");
		button.click();
		expect(button.textContent).to.eq("Hello John!");
	});
});
