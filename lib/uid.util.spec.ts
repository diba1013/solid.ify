import { uid } from "~/uid.util";
import { describe, it } from "vitest";

describe("uid", () => {
	it("should retain the proper length between updates to ensure collision statistics", ({ expect }) => {
		const result = uid();

		expect(result).to.have.length(7);
	});
});
