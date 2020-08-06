import { StateXGetter, StateXSetter } from '@cloudio/statex';
import { getPath } from './state';
import { post } from './api';

class Store {
  ds: string;
  alias: string;
  get: StateXGetter;
  set: StateXSetter;
  recordAction: any;
  recordsPath: string[];
  originalRecordsPath: string[];
  originalRecordIndexPath: string[];
  recordIndexPath: string[];
  currentRecord: string[];
  currentRecordIndex: string[];

  constructor(
    ds: string,
    alias: string,
    set: StateXSetter,
    get: StateXGetter,
    recordAction: any,
  ) {
    this.ds = ds;
    this.alias = alias;
    this.set = set;
    this.get = get;
    this.recordAction = recordAction;
    this.recordsPath = getPath('pageId', ds, alias, 'records');
    this.originalRecordsPath = getPath('pageId', ds, alias, 'originalRecords');
    this.recordIndexPath = getPath('pageId', ds, alias, 'records', ':index');
    this.originalRecordIndexPath = getPath(
      'pageId',
      ds,
      alias,
      'originalRecords',
      ':index',
    );
    this.currentRecord = getPath('pageId', ds, alias, 'currentRecord');
    this.currentRecordIndex = getPath(
      'pageId',
      ds,
      alias,
      ':currentRecordIndex',
    );
  }

  records = () => {
    return this.get(this.recordsPath);
  };

  setRecords = (records: any) => {
    this.set(this.recordsPath, records);
  };

  isAttributeDirty = (recordIndex: number, attribute: string): boolean => {
    //@ts-ignore
    const record = this.get(this.recordIndexPath, {
      params: {
        index: recordIndex,
      },
    });
    //@ts-ignore
    console.log('record>>', record);

    //@ts-ignore
    if (record._orig && record._orig[attribute]) {
      //@ts-ignore

      return record[attribute] !== record._orig[attribute];
    }
    return false;
  };

  isStoreDirty = () => {
    const recs = this.get(this.recordsPath);
    const originalRecs = this.get(this.originalRecordsPath);
    if (originalRecs == null) {
      return false;
    }
    return recs !== originalRecs;
  };

  isRecordDirty = (index: number) => {
    const rec = this.get(this.recordIndexPath, {
      params: {
        index,
      },
    });
    const originalRec = this.get(this.recordIndexPath, {
      params: {
        index,
      },
    });
    return rec !== originalRec;
  };

  _setCurrentRecord = (record: any, index: number) => {
    //@ts-ignore
    this.set(this.currentRecord, record);
    this.set(this.currentRecordIndex, record, {
      params: {
        currentRecordIndex: index,
      },
    });
  };

  getCurrentRecord = () => {
    return this.get(this.currentRecord);
  };

  setCurrentRecordIndex = (index: number) => {
    //@ts-ignore
    if (index >= this.records().length) {
      //@ts-ignore
      throw Error(
        `Developer ErrorIndex [${index}] being set as current record index cannot be more than the total records [${
          //@ts-ignore
          this.records().length
        }]! ${this.alias}`,
      );
    }
    //@ts-ignore
    this._setCurrentRecord(this.records()[index], index);
  };

  setCurrentRecord = (record: any) => {
    //@ts-ignore
    const index = this.records().indexOf(record);
    if (index === -1) {
      throw Error('Index not found');
    }
    //@ts-ignore
    this._setCurrentRecord(record, index);
  };

  reset = () => {
    this.setRecords(this.get(this.originalRecordsPath));
  };

  isBusy = () => {
    return true;
  };

  resetRecord = (index: number) => {
    const originalRecord = this.get(this.originalRecordIndexPath, {
      params: {
        index,
      },
    });
    this.set(this.recordIndexPath, originalRecord, {
      params: {
        index: index,
      },
    });
  };

  query = async (filter: any) => {
    const reqBody = {
      [this.alias]: {
        ds: this.ds,
        query: {
          filter,
        },
      },
    };
    await post(reqBody)
      .then((response) => {
        this.setRecords(response[this.alias].data);
        this.set(this.originalRecordsPath, response[this.alias].data);
        console.log('orig', this.get(this.originalRecordsPath));
      })
      .catch((error) => console.log('error from fetching', error));
  };

  updateRecord = (index: number, partialRecord: any) => {
    // todo
    this.recordAction({
      store: this,
      actionType: 'U',
      index,
      partialRecord,
    });
  };

  createNew = () => {
    this.recordAction({
      store: this,
      actionType: 'N',
    });
  };

  insertRecordPartial = (partialRecord: any) => {
    this.recordAction({
      store: this,
      actionType: 'I',
      index: -1,
      partialRecord,
    });
  };

  // TODO: update records using index
  updateRecords = (records: any) => {
    const storeRecords: any = this.records();
    this.dirtyRecords().forEach((record: any) => {
      const recIndex = storeRecords.indexOf(record);
      // index based logic not working
      if (recIndex !== undefined && recIndex !== -1) {
        const currentRecord: any = this.get(this.recordIndexPath, {
          params: {
            id: recIndex,
          },
        });
        if (currentRecord._rs === 'D') {
          this.recordAction(this.deleteFromStore(recIndex));
        } else {
          const newRecord = { ...currentRecord, ...record };
          this.set(this.recordIndexPath, newRecord, {
            params: {
              id: recIndex,
            },
          });
        }
      } else {
        storeRecords.forEach((storeRecord: any) => {
          if (record.name === storeRecord.name) {
            const recIdx = storeRecords.indexOf(storeRecord);
            if (record._deleted === 'Y' || record._rs === 'D') {
              // remove from list using index
              this.deleteFromStore(recIdx);
            } else {
              const newRecord = { ...storeRecord, ...record };
              this.set(this.recordIndexPath, newRecord, {
                params: {
                  index: recIdx,
                },
              });
            }
          }
        });
      }
    });
  };

  dirtyRecords = () => {
    // @ts-ignore
    let dirtyRecords = this.records().filter(
      // @ts-ignore
      (record: any) => record._rs !== 'Q',
    );
    return dirtyRecords;
  };

  isDirty = () => {
    return this.dirtyRecords().length > 0;
  };

  save = async () => {
    const dirtyRecords = this.dirtyRecords().map((dirtyRecord: any) => {
      const { _orig, ...restoftheobject } = dirtyRecord;
      console.log('restoftheobject', restoftheobject);
      return restoftheobject;
    });
    const reqBody = {
      [this.alias]: {
        ds: this.ds,
        data: dirtyRecords,
      },
    };
    console.log('reqBody', reqBody);

    await post(reqBody)
      .then((response) => {
        console.log('respinse', response);
        console.log('response[this.alias]', response[this.alias]);
        // update store records with db records
        this.updateRecords(response[this.alias].data);
      })
      .catch((error) => console.log('error from fetching', error));
  };

  delete = (index: number) => {
    this.recordAction({
      store: this,
      actionType: 'D',
      index,
    });
  };

  deleteFromStore = (index: number) => {
    this.recordAction({
      store: this,
      actionType: 'DeleteFromStore',
      index,
    });
  };
}

export default Store;
