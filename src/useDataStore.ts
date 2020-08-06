import Store from './Store';
import {
  useStateXSetter,
  useStateXGetter,
  useStateXAction,
} from '@cloudio/statex';
import { recordAction } from './state';

const cache = new Map<string, Store>();
export default (ds: string, alias: string) => {
  const get = useStateXGetter();
  const set = useStateXSetter();
  const recAction = useStateXAction(recordAction);
  let store = cache.get(ds + alias);
  if (!store) {
    store = new Store(ds, alias, set, get, recAction);
    cache.set(ds + alias, store);
  }
  return store;
};
