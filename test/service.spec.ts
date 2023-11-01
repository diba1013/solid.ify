import { useService } from "@/service";
import { renderHook } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

describe("useService", () => {
	it("should execute", async () => {
		const { result: cut } = renderHook(() => {
			return useService<string, number>("abc", {
				data() {
					return {
						data: "42",
					};
				},

				execute({ data }) {
					return Number.parseInt(data);
				},
			});
		});

		await cut.initialized;

		expect(cut.resource).is.eq(42);

		const r1 = await cut.refetch();
		expect(cut.resource).is.eq(42);
		expect(r1).is.eq(42);

		const r2 = await cut.refetch({
			data: "43",
		});

		expect(cut.resource).is.eq(43);
		expect(r2).is.eq(43);
	});
});
