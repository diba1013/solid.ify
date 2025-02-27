import type { MaybePromise } from "@diba1013/types";

export type ServiceContext<T> = {
	id?: string;
	data: T;
};

export type ResolvedServiceContext<T, R> = {
	id: string;
	data: T;
	signal: AbortSignal;
	last?: R;
	refetching: boolean;
};

export type Service<T, R> = {
	data: () => ServiceContext<T>;

	execute: (context: ResolvedServiceContext<T, R>) => MaybePromise<R>;

	init?: () => R;

	recover?: (context: ResolvedServiceContext<T, R>, error?: unknown) => MaybePromise<R>;

	cancel?: (context: ResolvedServiceContext<T, R>) => MaybePromise<void>;
};
