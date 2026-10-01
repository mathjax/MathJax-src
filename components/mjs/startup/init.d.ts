export function startup(ready: () => Promise<void>): Promise<void>;
export function readyAfter(component: string, setup: () => Promise<void>): Promise<void>;
