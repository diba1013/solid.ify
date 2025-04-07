import type {
	RawWrappedSignalInit,
	ReadableSignal,
	ReadableWrappedSignalInit,
	WrappedSignalInit,
	WritableSignal,
	WritableSignalSetter,
	WritableWrappedSignalInit,
} from "./signal.types";
import { SIGNAL_SYMBOL } from "./signal.types";
import { createSignal } from "solid-js";

function update<T>(setter: WritableSignalSetter<T>, previous?: T): T {
	if ("value" in setter) {
		return setter.value;
	}
	if ("get" in setter) {
		return setter.get(previous);
	}
	// Ignore undefined
	return previous as T;
}

function write<T>(write: WritableWrappedSignalInit<T>, id = Symbol()): WritableSignal<T> {
	return {
		[SIGNAL_SYMBOL]: id,

		get: (): T => {
			return write.get();
		},

		set(setter: WritableSignalSetter<T>): T {
			// Might need to call get within untrack?
			const next = update(setter, write.get());
			write.set(next);
			return next;
		},
	};
}

function read<T>(write: ReadableWrappedSignalInit<T>, id = Symbol()): ReadableSignal<T> {
	return {
		[SIGNAL_SYMBOL]: id,

		get: (): T => {
			return write.get();
		},
	};
}

function signal<T>(initial?: T, id = Symbol()): WritableSignal<T | undefined> {
	const [get, set] = createSignal<T | undefined>(initial, {
		name: String(id),
	});

	return {
		[SIGNAL_SYMBOL]: id,

		get: (): T | undefined => {
			return get();
		},
		set: (setter: WritableSignalSetter<T>): T => {
			return set((value): T => {
				return update(setter, value);
			});
		},
	};
}

/**
 * Creates a writable signal that optionally contains a value.
 */
export function wrap<T>(): WritableSignal<T | undefined>;

/**
 * Creates a writable signal that contains the respective value.
 *
 * @param initial The initial value to contain
 */
export function wrap<T>(initial: RawWrappedSignalInit<T>): WritableSignal<T>;

/**
 * Creates a readonly signal that reflects the value of the computation.
 * This does not hold a value.
 *
 * @param initial The computational function to invoke
 */
export function wrap<T>(initial: ReadableWrappedSignalInit<T>): ReadableSignal<T>;

/**
 * Creates a writable signal that proxies to the functions provided.
 * This does not hold a value.
 *
 * @param proxy The proxy functions to invoke.
 */
// eslint-disable-next-line @typescript-eslint/unified-signatures
export function wrap<T>(proxy: WritableWrappedSignalInit<T>): WritableSignal<T>;

export function wrap<T>(
	initial?: WrappedSignalInit<T>,
): ReadableSignal<T> | WritableSignal<T> | WritableSignal<T | undefined> {
	if (initial === undefined) {
		return signal();
	}

	if ("value" in initial) {
		return signal(initial.value);
	}

	if ("set" in initial && "get" in initial) {
		return write(initial);
	}

	if ("get" in initial) {
		return read(initial);
	}

	return signal();
}

/**
 * Checks if a signal or value conforms to the signal specification.
 * This is only the case if `SIGNAL_SYMBOL` is present and optionally a specific key (e.g. `set` or `get`).
 *
 * @param signal The signal to check for
 * @param key Check for a specific function to be present (double checking).
 * @returns If a signal meets the requirements
 */
export function is<
	T,
	Signal extends WritableSignal<unknown> | ReadableSignal<unknown> = T extends WritableSignal<infer R>
		? WritableSignal<R>
		: T extends ReadableSignal<infer R>
			? ReadableSignal<R>
			: WritableSignal<T> | ReadableSignal<T>,
>(signal: T | Signal, key?: keyof Signal): signal is Signal {
	if (signal === null || signal === undefined) {
		return false;
	}
	if (typeof signal !== "object") {
		return false;
	}
	if (SIGNAL_SYMBOL in signal) {
		return key === undefined || key in signal;
	}
	return false;
}
