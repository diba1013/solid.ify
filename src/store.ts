import { get, set } from "@/signal";
import { SIGNAL_SYMBOL } from "@/signal.types";
import {
	STORE_SYMBOL,
	type Store,
	type StoreContext,
	type StoreFactory,
	type StoreFunction,
} from "@/store.types";
import { createContext, useContext } from "solid-js";

// This is fine since we do not want to break type restrictions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Stores = createContext<StoreContext<any>>({
	context: undefined,
});

/**
 * Ensures that typescript can properly infer wrapped signal access for properties
 */
type WrappedStore<Stores extends object> = Store<{
	[K in keyof Stores]: Stores[K] & {
		[SIGNAL_SYMBOL]?: unknown;
	};
}>;

/**
 * Creates a store proxy handler for unwrapping signal properties.
 *
 * @returns A wrapped store proxy handler
 */
function store<T extends object>(): ProxyHandler<WrappedStore<T>> {
	return {
		get<Key extends keyof Store<T>>(
			target: WrappedStore<T>,
			p: string | symbol,
		) {
			const key = p as Key;
			const property = target[key];
			// Do not modify not owned properties, though might want to handle 'get' first?
			if (property[SIGNAL_SYMBOL] === undefined) {
				return property;
			}
			return get(property);
		},

		set<Key extends keyof WrappedStore<T>>(
			target: WrappedStore<T>,
			p: string | symbol,
			newValue: T[Key],
		) {
			const key = p as Key;
			const property = target[key];
			if (property[SIGNAL_SYMBOL] === undefined) {
				return false;
			}
			set(property, newValue);
			return true;
		},
	};
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
		const context = cxt.context as Context;
		if (context === undefined) {
			console.warn("Use <Stores.Provider> to provide context.");
		}
		const stores = cxt[STORE_SYMBOL];
		if (stores[id] === undefined) {
			try {
				// This is now a store wrapper
				const instance = factory(context) as Store<T>;
				stores[id] = new Proxy(instance, store());
			} catch (error) {
				console.error(`Could not instantiate store '${id}'.`, error);
				// This is a fallback to silently replace
				const fallback = {} as Store<T>;
				stores[id] = new Proxy(fallback, store());
			}
		}
		return stores[id] as Store<T>;
	};
}
