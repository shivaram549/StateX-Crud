import { action } from '@cloudio/statex';
import Store, { Data } from './Store';
export function getPath(
  pageId: string,
  ds: string,
  alias: string,
  recordsType?: string,
  indexKey?: string
): string[] {
  const path = ['root', pageId, 'dataStore', ds, alias];
  if (recordsType) {
    path[path.length] = recordsType;
  }
  if (indexKey) {
    path[path.length] = indexKey;
  }
  console.log('records path', path);
  return path;
}

export const recordAction = action(
  (
    { get, set },
    {
      store,
      actionType,
      index,
      partialRecord,
    }: {
      store: Store;
      actionType: string;
      index?: number;
      partialRecord?: Data;
    }
  ) => {
    let path;
    let records;
    switch (actionType) {
      case 'N':
        path = store.recordsPath;
        records = get(path) as [];
        records = [...records, { _rs: 'N' }];
        set(path, records);
        break;
      case 'U':
      case 'D':
        if (index !== undefined) {
          path = store.recordIndexPath;
          let record: Data = get(path, {
            params: { index },
          });
          record = { ...record };
          if (partialRecord) {
            if (!record._orig && record._rs === 'Q') {
              record = { ...record, _orig: record };
            }
            record = { ...record, ...partialRecord };
          }
          record = { ...record, _rs: actionType };
          set(path, record, {
            params: { index },
          });
        }

        break;

      case 'DeleteFromStore':
        if (index) {
          path = store.recordsPath;
          records = get(path) as [];
          records = records
            .slice(0, index)
            .concat(records.slice(index + 1, records.length));
          set(path, records);
        }

        break;
    }
  }
);
