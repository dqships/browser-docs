const LOCK_NAME = "webtomarkdown-copy-history";

let localQueue = Promise.resolve();

// Runs task with exclusive access to the copy history. The popup and the
// service worker share the extension origin, so the Web Locks API serializes
// writes between them. Where it is missing, writes are at least serialized
// within this page.
export function withHistoryLock(task) {
  if (globalThis.navigator?.locks?.request) {
    return navigator.locks.request(LOCK_NAME, () => task());
  }

  const run = localQueue.then(() => task());
  localQueue = run.catch(() => {});
  return run;
}
