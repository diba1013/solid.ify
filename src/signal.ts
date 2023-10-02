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

function isSetter<T>(
	value: T | WritableSignalSetter<T>,
): value is WritableSignalSetter<T> {
	return typeof value === "function";
}

function write<T>(
	write: WritableWrappedSignalInit<T>,
	id = Symbol(),
): WritableSignal<T> {
	return {
		[SIGNAL_SYMBOL]: id,

		get(): T {
			return write.get();
		},

		set(value: T | WritableSignalSetter<T>) {
			if (isSetter(value)) {
				const update = value(write.get());
				write.set(update);
				return update;
			} else {
				write.set(value);
				return value;
			}
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

		get,
		set,
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

export function get<T>(signal: T | ReadableSignal<T>): T {
	if (signal === null || signal === undefined) {
		return signal;
	}
	if (typeof signal !== "object") {
		return signal;
	}
	if ("get" in signal) {
		return signal.get();
	}
	return signal;
}

export function set<T, R>(signal: WritableSignal<T> | R, value: T): T {
	if (signal === null || signal === undefined) {
		return value;
	}
	if (typeof signal !== "object") {
		return value;
	}
	if ("set" in signal) {
		return signal.set(value);
	}
	return value;
}
