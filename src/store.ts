import type { ReadableSignal, WritableSignal } from "@/signal.types";
import { is } from "@/signal";
import { type Store, STORE_SYMBOL, type StoreContext, type StoreFactory, type StoreFunction } from "@/store.types";
import { createContext, useContext } from "solid-js";

// This is fine since we do not want to break type restrictions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Stores = createContext<StoreContext<any>>({
	context: undefined,
});

/**
 * Creates a store proxy handler for unwrapping signal properties.
 *
 * @returns A wrapped store proxy handler
 */
export function store<T extends object>(instance: T): Store<T> {
	return new Proxy(instance as Store<T>, {
		// Declaring type mapping aids in readability as this rule is not able to correctly capture inlining causing duplications.
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
		get<Key extends keyof Store<T>, Value = Store<T>[Key]>(target: Store<T>, p: string | symbol) {
			const key = p as Key;
			const property = target[key] as Value;
			if (is<Value, ReadableSignal<Value>>(property, "get")) {
				return property.get();
			}
			return property;
		},

		// Declaring type mapping aids in readability as this rule is not able to correctly capture inlining causing duplications.
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
		set<Key extends keyof Store<T>, Value = Store<T>[Key]>(target: Store<T>, p: string | symbol, newValue: Value) {
			const key = p as Key;
			const property = target[key] as Value;
			if (is<Value, WritableSignal<Value>>(property, "set")) {
				property.set({
					value: newValue,
				});
				return true;
			}
			return false;
		},
	});
}

export function defineStore<Context extends object, T extends object>(
	id: string,
	factory: StoreFactory<Context, T>,
): StoreFunction<T> {
	return (): Store<T> => {
		const cxt = useContext(Stores);
		if (cxt[STORE_SYMBOL] === undefined) {
			cxt[STORE_SYMBOL] = {};
		}
		// Casting might be fine, but cannot verify at this point
		const context = cxt.context as Context | undefined;
		if (context === undefined) {
			console.warn("Use <Stores.Provider> to provide context.");
		}
		const stores = cxt[STORE_SYMBOL];
		if (stores[id] === undefined) {
			try {
				// This is now a store wrapper
				const instance = factory(context ?? ({} as Context)) as Store<T>;
				stores[id] = store(instance);
			} catch (error) {
				console.error(`Could not instantiate store '${id}'.`, error);
				// This is a fallback to silently replace
				const fallback = {} as Store<T>;
				stores[id] = store(fallback);
			}
		}
		return stores[id] as Store<T>;
	};
}
