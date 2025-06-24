declare module 'node:worker_threads' {
  const parentPort: {
    on(kind: string, listener: (event: Event) => void): void;
    postMessage(msg: any): void;
  };
  const workerData: any;
}
