# solid.ify

Collection of wrappers to handle solid signals with ease.

## Usage

```tsx
// Create a shared state outside of components.
const useUser = defineStore("user", (services) => {
	// This is injected during initialization.
	const { backend } = services;

	const user = wrap({});

	return {
		greeting: wrap({
			get: () => {
				const resolved = user.get();
				return `Hello, ${resolved?.name ?? "Unknown"}`;
			},
		}),

		login: async (username: string, password: string) => {
			// Perform some complex logic here.
			user.set({
				value: await backend.login({ username, password }),
			});
		},

		logout: async () => {
			// Revoke session in the backend.
			user.set({
				value: {},
			});
		},
	};
});

// Use the store within a component and access the unwrapped properties.
const App: Component = () => {
	const user = useUser();

	return (
		<>
			<div>{cut.greeting}</div>
		</>
	);
};

// Wrap the root context with the store providers (note the object usage).
const Root: Component = () => {
	// Injected to each stores factory method.
	const services = {};

	return (
		<Stores.Provider value={{ context: services }}>
			<App />
		</Stores.Provider>
	);
};
```
