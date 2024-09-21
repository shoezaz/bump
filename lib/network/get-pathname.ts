import { requestAsyncStorage } from 'next/dist/client/components/request-async-storage.external';
import { hasBasePath } from 'next/dist/client/has-base-path';
import { removeBasePath } from 'next/dist/client/remove-base-path';

export function getPathname(): string | null {
  const store = requestAsyncStorage.getStore();
  if (!store) {
    return null;
  }

  const url = new URL(store.url.pathname + store.url.search, 'http://n');
  if (hasBasePath(url.pathname)) {
    return removeBasePath(url.pathname) + url.search;
  }

  return url.pathname + url.search;
}
