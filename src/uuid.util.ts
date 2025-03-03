import { hexoid } from "hexoid";

/**
 * This methods generates a local unique id within a limited scope.
 *
 * Taking the {@link https://betterexplained.com/articles/understanding-the-birthday-paradox/ birthday-paradox} into account,
 * this would allow for `2300` elements for a `1%`, `730` for a `0.1%` and `230` for a `0.01%` collision chance.
 *
 * @see https://github.com/lukeed/hexoid
 */
export const uid = hexoid(7);
