import { action } from '@cloudio/statex';

export function getPath(
  pageId: string,
  ds: string,
  alias: string,
  recordsType?: string,
  indexKey?: string,
): string[] {
  const rootPath = ['root', pageId, 'dataStore', ds, alias];
  if (recordsType) {
    rootPath[rootPath.length] = recordsType;
  }
  if (indexKey) {
    rootPath[rootPath.length] = indexKey;
  }
  console.log('root records path', rootPath);
  return rootPath;
}

// @ts-ignore

export const recordAction = action(
  (
    { get, set },
    {
      store,
      actionType,
      index,
      partialRecord,
    }: { store: any; actionType: string; index?: number; partialRecord?: any },
  ) => {
    let path;
    let records;
    switch (actionType) {
      case 'N':
        path = store.recordsPath;
        records = get(path) as [];
        records = [...records, {}];
        set(path, records);
        break;
      case 'U':
      case 'D':
        if (index !== undefined) {
          path = store.recordIndexPath;
          let record = get(path, {
            params: { index },
          });
          // @ts-ignore
          record = { ...record };
          if (partialRecord) {
            // @ts-ignore
            if (!record._orig && record._rs === 'Q') {
              // @ts-ignore
              record = { ...record, _orig: record };
            }
            // @ts-ignore
            record = { ...record, ...partialRecord };
          }
          // @ts-ignore
          record = { ...record, _rs: actionType };
          // set back to list
          // @ts-ignore
          set(path, record, {
            params: { index },
          });
        }

        break;

      case 'DeleteFromStore':
        if (index) {
          path = store.recordsPath;
          records = get(path) as [];
          // @ts-ignore
          records = records
            .slice(0, index)
            .concat(records.slice(index + 1, records.length));
          set(path, records);
        }

        break;
    }
  },
);
