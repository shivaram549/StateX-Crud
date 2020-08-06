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
          let targetRecord: Data = get(path, {
            params: { index },
          });
          targetRecord = { ...targetRecord };
          if (actionType === 'D') {
            targetRecord = { ...targetRecord, _rs: 'D' };
          } else if (partialRecord) {
            Object.keys(partialRecord).forEach((key) => {
              // targetRecord
              const currVal = targetRecord[key];
              const newVal = partialRecord[key];
              if (currVal !== newVal) {
                if (!targetRecord._orig && targetRecord._rs === 'Q') {
                  targetRecord = { ...targetRecord, _orig: targetRecord };
                }
                targetRecord = { ...targetRecord, [key]: partialRecord[key] };
                let _rs = '';
                if (targetRecord._rs === 'N') {
                  _rs = 'I';
                } else if (targetRecord._rs === 'Q') {
                  _rs = 'U';
                }
                if (_rs !== '') {
                  targetRecord = { ...targetRecord, _rs };
                }
              }
            });
          }
          set(path, targetRecord, {
            params: { index },
          });
        }

        break;

      case 'DeleteFromStore':
        if (index !== undefined && index !== -1) {
          path = store.recordsPath;
          records = get(path) as [];
          records = records
            .slice(0, index)
            .concat(records.slice(index + 1, records.length));
          set(path, records);

          path = store.originalRecordsPath;
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
