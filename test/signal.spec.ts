import { wrap } from "@/signal";
import { describe, expect, it } from "vitest";

describe("wrap", () => {
	it("without value should provide default writable signal", () => {
		const cut = wrap();

		expect(cut.get()).is.undefined;

		const r1 = cut.set({ value: "0" });
		expect(r1).is.eq("0");
		expect(cut.get()).is.eq("0");

		const r2 = cut.set({
			get: (value) => {
				return `${String(value)}1`;
			},
		});
		expect(r2).is.eq("01");
		expect(cut.get()).is.eq("01");
	});

	it("with value should provide initialized writable signal", () => {
		const proxy = {
			value: "0",
		};

		const cut = wrap(proxy);

		expect(cut.get()).is.eq("0");

		cut.set({ value: "1" });

		expect(proxy.value).is.eq("0");
		expect(cut.get()).is.eq("1");
	});

	it("with writable computed value should invoke methods", () => {
		const proxy = {
			value: "0",
		};

		const cut = wrap({
			get(): string {
				return proxy.value;
			},

			set(value: string) {
				proxy.value = value;
			},
		});

		expect(cut.get()).is.eq("0");

		cut.set({ value: "1" });

		expect(proxy.value).is.eq("1");
		expect(cut.get()).is.eq("1");
	});

	it("with readable computed value should invoke methods", () => {
		const proxy = {
			value: "0",
		};

		const cut = wrap({
			get(): string {
				return proxy.value;
			},
		});

		expect(cut.get()).is.eq("0");
	});
});
