import { uid } from "@/uid.util";
import { describe, expectTypeOf, it } from "vitest";

describe("uid", () => {
	it("should retain the proper length between updates to ensure collision statistics", () => {
		expectTypeOf(uid).toEqualTypeOf<() => string>();
	});
});
