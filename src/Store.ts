import { StateXGetter, StateXSetter } from '@cloudio/statex';
import { getPath } from './state';
import { post } from './api';

export interface Data {
  [key: string]: any;
  _orig: any;
  // key: string;
  // value: any;
  _rs: string;
}

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
  currentRecord: string[]; // remove this
  currentRecordIndexPath: string[];
  isBusyPath: string[];

  constructor(
    ds: string,
    alias: string,
    set: StateXSetter,
    get: StateXGetter,
    recordAction: any
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
      ':index'
    );
    this.currentRecord = getPath('pageId', ds, alias, 'currentRecord');
    this.currentRecordIndexPath = getPath(
      'pageId',
      ds,
      alias,
      ':currentRecordIndex'
    );
    this.isBusyPath = getPath('pageId', ds, alias, 'busy');
  }

  records = (): Data[] => this.get(this.recordsPath);

  originalRecords = () => this.get(this.originalRecordsPath);

  setRecords = (records: any) => this.set(this.recordsPath, records);

  setRecord = (index: number, record: Data) => {
    this.set(this.recordIndexPath, record, {
      params: {
        index: index,
      },
    });
  };

  getRecord = (recordIndex: number): Data =>
    this.get(this.recordIndexPath, {
      params: {
        index: recordIndex,
      },
    });

  getoriginalRecord = (recordIndex: number): Data =>
    this.get(this.originalRecordIndexPath, {
      params: {
        index: recordIndex,
      },
    });

  setOriginalRecord = (index: number, record: Data) => {
    this.set(this.originalRecordIndexPath, record, {
      params: {
        index: index,
      },
    });
  };

  isAttributeDirty = (recordIndex: number, attribute: string): boolean => {
    const record: Data = this.getRecord(recordIndex);
    if (record._orig && record._orig[attribute]) {
      return record[attribute] !== record._orig[attribute];
    }
    return false;
  };

  isStoreDirty = () => {
    const recs = this.records();
    const originalRecs = this.originalRecords();
    if (originalRecs == null) {
      return false;
    }
    return JSON.stringify(recs) !== JSON.stringify(originalRecs);
  };

  isRecordDirty = (index: number) => {
    const rec = this.getRecord(index);
    const originalRec = this.getoriginalRecord(index);
    if (originalRec === null || originalRec === undefined) {
      return false;
    }
    return JSON.stringify(rec) !== JSON.stringify(originalRec);
  };

  _setCurrentRecord = (record: any, index: number) => {
    this.set(this.currentRecord, record);
    this.set(this.currentRecordIndexPath, record, {
      params: {
        currentRecordIndex: index,
      },
    });
  };

  getCurrentRecord = () => this.get(this.currentRecord);

  setCurrentRecordIndex = (index: number) => {
    if (index >= this.records().length) {
      throw Error(
        `Developer ErrorIndex [${index}] being set as current record index cannot be more than the total records [${
          this.records().length
        }]! ${this.alias}`
      );
    }
    this._setCurrentRecord(this.records()[index], index);
  };

  setCurrentRecord = (record: any) => {
    const index = this.records().indexOf(record);
    if (index === -1) {
      throw Error('Index not found');
    }
    this._setCurrentRecord(record, index);
  };

  reset = () => this.setRecords(this.get(this.originalRecordsPath));

  resetCurrentRecord = () => {
    const idx: number = this.get(this.currentRecordIndexPath);
    this.resetRecord(idx);
  };

  resetRecord = (index: number) => {
    const originalRecord = this.getoriginalRecord(index);
    this.setRecord(index, originalRecord);
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
    this.set(this.isBusyPath, true);
    await post(reqBody)
      .then((response) => {
        this.setRecords(response[this.alias].data);
        this.set(this.originalRecordsPath, response[this.alias].data);
        this.set(this.isBusyPath, false);
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

  updateFromServer = (recIndex: number, records: any) => {
    this.setOriginalRecord(recIndex, records[recIndex]);
    this.setRecord(recIndex, records[recIndex]);
  };

  // TODO: update records using index
  updateRecords = (records: any) => {
    const storeRecords: any = this.records();
    this.dirtyRecords().forEach((record: any) => {
      const recIndex = storeRecords.indexOf(record);
      // index based logic not working
      if (recIndex !== undefined && recIndex !== -1) {
        const currentRecord: any = this.getRecord(recIndex);
        if (currentRecord._rs === 'D') {
          this.recordAction(this.deleteFromStore(recIndex));
        } else {
          // const newRecord = { ...currentRecord, ...record };
          this.updateFromServer(recIndex, records);
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
              this.setRecord(recIdx, newRecord);
            }
          }
        });
      }
    });
    this.set(this.isBusyPath, false);
  };

  dirtyRecords = () => {
    let dirtyRecords = this.records().filter(
      (record: any) => record._rs !== 'Q'
    );
    return dirtyRecords;
  };

  isDirty = () => this.dirtyRecords().length > 0;

  isBusy = () => this.get(this.isBusyPath);

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
    this.set(this.isBusyPath, true);

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
