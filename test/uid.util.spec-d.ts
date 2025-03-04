import { uid } from "@/uid.util";
import { describe, expectTypeOf, it } from "vitest";

describe("uid", () => {
	it("should retain the proper method declaration between updates", () => {
		expectTypeOf(uid).toEqualTypeOf<() => string>();
	});
});
