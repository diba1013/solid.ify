export const SIGNAL_SYMBOL = Symbol("solid:signal");

export type WritableWrappedSignalInit<T> = {
	get(): T;

	set(value: T): void;
};

export type ReadableWrappedSignalInit<T> = {
	get(): T;
};

export type RawWrappedSignalInit<T> = {
	value: T;
};

export type WrappedSignalInit<T> =
	| RawWrappedSignalInit<T>
	| ReadableWrappedSignalInit<T>
	| WritableWrappedSignalInit<T>;

export type ReadableSignal<T> = {
	[SIGNAL_SYMBOL]: symbol;

	get(): T;
};

export type ReadableSignalEffect<T> = (previous?: T) => T;

export type WritableSignal<T> = {
	[SIGNAL_SYMBOL]: symbol;

	get(): T;

	set(value: WritableSignalSetter<T>): T;
};

export type WritableSignalSetter<T> =
	| {
			value: T;
	  }
	| {
			get: (previous?: T) => T;
	  };
