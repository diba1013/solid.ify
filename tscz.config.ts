import { defineConfig } from "@diba1013/tscz";

const NAME = "ts";
const SOURCE = "lib";

function input(name: string): string {
	return `${SOURCE}/${name}`;
}

export default defineConfig({
	name: NAME,
	entries: [
		{
			name: "library",
			input: input("library.ts"),
			output: ["cjs", "esm", "dts"],
		},
	],
});
