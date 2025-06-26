/// <reference types="vite/client" />

namespace globalThis {
	// Extend globalThis to include PocketBase types
	interface Window {
		pb: import("pocketbase").default;
		dm_message_unsubscribe: null | (() => void);
	}
}