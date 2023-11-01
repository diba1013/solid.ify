import {
	ReadableSignal,
	SIGNAL_SYMBOL,
	WritableSignal,
	WritableSignalSetter,
} from "@/signal.types";

export function is<
	T,
	Signal extends WritableSignal<T> | ReadableSignal<T> =
		| WritableSignal<T>
		| ReadableSignal<T>,
>(signal: T | Signal): signal is Signal {
	if (signal === null || signal === undefined) {
		return false;
	}
	if (typeof signal !== "object") {
		return false;
	}
	if (SIGNAL_SYMBOL in signal) {
		return true;
	}
	return false;
}

/**
 * Retrieves the value stored within a {@link ReadableSignal<T>} or {@link WritableSignal}.
 * If the signal is not wrapped, it will be returned without modification.
 *
 * @param signal The signal to read from
 */
export function get<T>(signal: T | WritableSignal<T> | ReadableSignal<T>): T {
	if (is<T, ReadableSignal<T>>(signal) && "get" in signal) {
		return signal.get();
	}
	return signal;
}

export function set<T>(
	signal: T | WritableSignal<T>,
	value: WritableSignalSetter<T>,
): T | undefined {
	if (is<T, WritableSignal<T>>(signal) && "set" in signal) {
		return signal.set(value);
	}
	return undefined;
}
