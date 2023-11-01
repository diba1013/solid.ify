import type {
	ResolvedServiceContext,
	Service,
	ServiceContext,
} from "@/service.types";
import { wrap } from "@/signal";
import { store } from "@/store";
import { uid } from "@/uuid.util";
import { createResource } from "solid-js";

type Resolver = () => void;

type IntermediateServiceContext<T> = {
	context: ServiceContext<T>;
};

type RefetchingServiceContext<T> = {
	context?: ServiceContext<T>;
};

type PartiallyResolvedServiceContext<T> = {
	context?: ServiceContext<T>;
	refetching: boolean;
};

function build<T, R>(
	context: ServiceContext<T>,
	refetching: RefetchingServiceContext<T> | boolean,
	last?: R,
): ResolvedServiceContext<T, R> {
	const {
		context: { id = uid(), data } = context,
		refetching: reload,
	}: PartiallyResolvedServiceContext<T> =
		typeof refetching === "boolean"
			? {
					refetching,
			  }
			: {
					context: refetching.context,
					refetching: true,
			  };

	const { signal } = new AbortController();
	return {
		id,
		data,
		signal,
		last,
		refetching: reload,
	};
}

const RESOLVED = Promise.resolve();

export function useService<T, R>(id: string, service: Service<T, R>) {
	let resolved: Resolver | undefined;
	const initialized = new Promise<void>((resolve) => {
		resolved = resolve;
	});

	const [resource, actions] = createResource<
		R,
		IntermediateServiceContext<T>,
		RefetchingServiceContext<T>
	>(
		() => {
			return {
				context: service.data(),
			};
		},
		async ({ context }, { value: last, refetching }) => {
			const input = build(context, refetching, last);
			try {
				return await service.execute(input);
			} catch (error) {
				if (service.recover !== undefined) {
					return await service.recover(input);
				}
				throw error;
			} finally {
				// Wait one tick for resolving
				await RESOLVED.then(() => {
					// TODO this could be handled better
					requestAnimationFrame(() => {
						resolved?.();
					});
					return 42;
				});
			}
		},
		{
			name: id,
			initialValue: service.init?.(),
		},
	);

	return store({
		initialized,

		resource: wrap({
			get(): R {
				const resolved = resource() ?? service.init?.();
				// We made sure that this cannot happen?
				return resolved as R;
			},

			set: (value: R) => {
				actions.mutate(() => {
					return value;
				});
			},
		}),

		latest: wrap({
			get() {
				return resource.latest;
			},
		}),

		state: wrap({
			get() {
				return resource.state;
			},
		}),

		loading: wrap({
			get() {
				return resource.loading;
			},
		}),

		refetch: async (context?: ServiceContext<T>) => {
			return actions.refetch({
				context,
			});
		},
	});
}
