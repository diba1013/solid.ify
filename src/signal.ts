import {
	RawWrappedSignalInit,
	ReadableSignal,
	ReadableWrappedSignalInit,
	SIGNAL_SYMBOL,
	WrappedSignalInit,
	WritableSignal,
	WritableSignalSetter,
	WritableWrappedSignalInit,
} from "./signal.types";
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

function write<T>(
	write: WritableWrappedSignalInit<T>,
	id = Symbol(),
): WritableSignal<T> {
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

function read<T>(
	write: ReadableWrappedSignalInit<T>,
	id = Symbol(),
): ReadableSignal<T> {
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

export function wrap<T>(): WritableSignal<T | undefined>;

export function wrap<T>(initial: RawWrappedSignalInit<T>): WritableSignal<T>;

export function wrap<T>(
	initial: ReadableWrappedSignalInit<T>,
): ReadableSignal<T>;

export function wrap<T>(
	initial: WritableWrappedSignalInit<T>,
): WritableSignal<T>;

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
