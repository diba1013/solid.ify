import { get, set } from "@/compute";
import { wrap } from "@/signal";
import { WritableSignal } from "@/signal.types";
import { describe, expect, it } from "vitest";

describe("get", () => {
	it("with non-readable value should return value", () => {
		// eslint-disable-next-line unicorn/no-useless-undefined
		expect(get(undefined)).is.undefined;
		// eslint-disable-next-line unicorn/no-null
		expect(get(null)).is.null;

		expect(get(0)).is.eql(0);
		expect(get(1)).is.eql(1);

		expect(get("")).is.eql("");
		expect(get("0")).is.eql("0");

		expect(get([])).is.eql([]);
		expect(get(["0"])).is.eql(["0"]);

		expect(get({})).is.eql({});
		expect(get({ price: 1 })).is.eql({ price: 1 });
	});

	it("with non-wrapped value should not unwrap property", () => {
		expect(
			get<{ value: number }>({
				value: 0,
			}),
		).is.not.eql(0);

		expect(
			get<{ get: () => number }>({
				get() {
					return 0;
				},
			}),
		).is.not.eql(0);
	});

	it("without value should retrieve undefined", () => {
		const cut = wrap();

		expect(get(cut)).is.undefined;
	});

	it("with value should retrieve value", () => {
		const cut = wrap({
			value: "0",
		});

		expect(get(cut)).is.eq("0");
	});

	it("with writable computed value should retrieve value", () => {
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

		expect(get(cut)).is.eq("0");
	});

	it("with readable computed value should retrieve value", () => {
		const proxy = {
			value: "0",
		};

		const cut = wrap({
			get(): string {
				return proxy.value;
			},
		});

		expect(get(cut)).is.eq("0");
	});
});

describe("set", () => {
	it("with non-readable value should return value", () => {
		// eslint-disable-next-line unicorn/no-useless-undefined
		expect(set(undefined, { value: 0 })).is.undefined;
		// eslint-disable-next-line unicorn/no-null
		expect(set(null, { value: 0 })).is.undefined;

		expect(set(0, { value: 1 })).is.undefined;
		expect(set(1, { value: 0 })).is.undefined;

		expect(set("", { value: "0" })).is.undefined;
		expect(set("0", { value: "" })).is.undefined;

		expect(set([], { value: [1] })).is.undefined;
		expect(set(["0"], { value: [] })).is.undefined;

		expect(set({}, { value: { price: 1 } })).is.undefined;
		expect(set({ price: 1 }, { value: { price: 0 } })).is.undefined;
	});

	it("with non-wrapped value should not unwrap property", () => {
		expect(
			set(
				{
					value: 0,
				} as unknown as WritableSignal<number>,
				{
					value: 1,
				},
			),
		).is.undefined;

		expect(
			set(
				{
					set() {
						return 0;
					},
				} as unknown as WritableSignal<number>,
				{
					value: 1,
				},
			),
		).is.undefined;
	});

	it("without value should update value", () => {
		const cut = wrap();

		expect(set(cut, { value: 1 })).is.eql(1);
		expect(cut.get()).is.eql(1);
	});

	it("with value should retrieve value", () => {
		const cut = wrap({
			value: "0",
		});

		expect(get(cut)).is.eq("0");
	});

	it("with writable computed value should retrieve value", () => {
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

		expect(get(cut)).is.eq("0");
	});

	it("with readable computed value should retrieve value", () => {
		const proxy = {
			value: "0",
		};

		const cut = wrap({
			get(): string {
				return proxy.value;
			},
		});

		expect(get(cut)).is.eq("0");
	});
});
