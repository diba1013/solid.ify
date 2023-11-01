import { wrap } from "@/signal";
import { cleanup, renderHook } from "@solidjs/testing-library";
import { createEffect } from "solid-js";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("foo", () => {
	afterEach(cleanup);

	it("demo test", () => {
		const {
			result: { cut, watcher },
		} = renderHook(() => {
			const cut = wrap<string>();
			const watcher = vi.fn(() => {
				cut.get();
			});
			createEffect(watcher);

			return { cut, watcher };
		});

		cut.set({
			value: "Hello",
		});

		expect(watcher).toHaveBeenCalledTimes(2);
	});
});
