import { is, wrap } from "~/signal";
import { RawWrappedSignalInit, ReadableSignal, WritableSignal, WritableSignalSetter } from "~/signal.types";
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

		cut.set({
			get: (a = "") => a + "2",
		});
	});

	it("with writable computed value should invoke update methods", () => {
		const proxy: RawWrappedSignalInit<string | undefined> = {
			value: undefined,
		};

		const cut = wrap({
			get(): string | undefined {
				return proxy.value;
			},

			set(value: string) {
				proxy.value = value;
			},
		});

		cut.set({ get: (a = "") => a + "1" });
		expect(proxy.value).is.eq("1");

		cut.set({ get: (a = "") => a + "2" });
		expect(proxy.value).is.eq("12");

		cut.set({} as WritableSignalSetter<string | undefined>);
		expect(proxy.value).is.eq("12");
	});

	it("with writable computed value should not invoke invalid update method", () => {
		const proxy: RawWrappedSignalInit<string> = {
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

		cut.set({} as WritableSignalSetter<string>);
		expect(proxy.value).is.eq("0");
		expect(cut.get()).is.eq("0");
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

describe("is", () => {
	it("should return false for non signal", () => {
		expect(is("")).is.false;
		expect(is("1")).is.false;
		expect(is(0)).is.false;
		expect(is(undefined)).is.false;
		// eslint-disable-next-line unicorn/no-null
		expect(is(null)).is.false;
	});

	it("should return false without proper signal symbol", () => {
		// mimic signal as close as possible
		const read = {
			get: () => "",
		} as unknown as ReadableSignal<string>;
		const write = {
			get: () => "",
			set: () => "",
		} as unknown as WritableSignal<string>;

		expect(is<string, ReadableSignal<string>>(read, "get")).is.false;
		expect(is<string, ReadableSignal<string>>(write, "get")).is.false;
		expect(is<string, WritableSignal<string>>(write, "set")).is.false;
	});

	it("should return true with undefined writable signal", () => {
		const signal = wrap<string>();

		expect(is(signal)).is.true;
		expect(is(signal, "get")).is.true;
		expect(is(signal, "set")).is.true;
	});

	it("should return true for predefined writable signal", () => {
		const signal = wrap({
			value: "",
		});

		expect(is(signal)).is.true;
		expect(is(signal, "get")).is.true;
		expect(is(signal, "set")).is.true;
	});

	it("should return true for computed signal", () => {
		const signal = wrap({
			get: () => {
				return "";
			},
		});

		expect(is(signal)).is.true;
		expect(is(signal, "get")).is.true;
		// @ts-expect-error Just checking for writable being false
		expect(is(signal, "set")).is.false;
	});

	it("should return true for writable computed signal", () => {
		const signal = wrap({
			get: () => {
				return "";
			},

			set: () => {
				// Ignore
			},
		});

		expect(is(signal)).is.true;
		expect(is(signal, "get")).is.true;
		expect(is(signal, "set")).is.true;
	});

	it("should return true for incompatible data object", () => {
		const cut = wrap({} as { value: string });

		expect(is(cut, "set")).to.be.true;
	});
});
