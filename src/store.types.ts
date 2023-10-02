import type { ReadableSignal, WritableSignal } from "./signal.types";

export type LooksLike<T, U> = {
	[K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type StateKeys<Store extends object> = LooksLike<
	Store,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	WritableSignal<any> // Ignore generic
>;

export type ComputedKeys<Store extends object> = LooksLike<
	Store,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	ReadableSignal<any> // Ignore generic
>;

export type RetainKeys<Store extends object> = Exclude<
	keyof Store,
	StateKeys<Store> | ComputedKeys<Store>
>;

export type StoreState<Store extends object> = {
	[K in StateKeys<Store>]: Store[K] extends WritableSignal<infer R>
		? R
		: never;
};

export type StoreGetters<Store extends object> = Readonly<{
	[K in ComputedKeys<Store>]: Store[K] extends ReadableSignal<infer R>
		? R
		: never;
}>;

export type StoreActions<Store extends object> = Readonly<{
	[K in RetainKeys<Store>]: Store[K];
}>;

export type Store<Store extends object> = StoreState<Store> &
	StoreGetters<Store> &
	StoreActions<Store>;

export const STORE_SYMBOL = Symbol("solid:store");

export type StoreContext<Context extends object> = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[STORE_SYMBOL]?: Record<string, Store<any>>;

	context: Context;
};

export type StoreFactory<Context, T extends object> = (context: Context) => T;
export type StoreFunction<T extends object> = () => Store<T>;
