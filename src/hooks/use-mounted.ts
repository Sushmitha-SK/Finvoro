import { useSyncExternalStore } from "react";

const subscribe = () => () => undefined;

/** true on the client after hydration, false on the server and during hydration. */
export function useMounted() {
    return useSyncExternalStore(subscribe, () => true, () => false);
}
