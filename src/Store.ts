import { StateXGetter, StateXSetter } from '@cloudio/statex';
import { getPath } from './state';
import { post } from './api';

export interface Data {
  [key: string]: any;
  // _orig: any;
  // key: string;
  // value: any;
  // _rs: string;
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
    this.currentRecordIndexPath = getPath(
      'pageId',
      ds,
      alias,
      'currentRecordIndex'
    );
    this.isBusyPath = getPath('pageId', ds, alias, 'busy');
  }

  records = (): Data[] => {
    return this.get(this.recordsPath);
  };

  originalRecords = () => {
    return this.get(this.originalRecordsPath);
  };

  setRecords = (records: Data[]) => {
    this.set(this.recordsPath, records);
  };

  setRecord = (index: number, record: Data) => {
    this.set(this.recordIndexPath, record, {
      params: {
        index,
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
        index,
      },
    });
  };

  isAttributeDirty = (recordIndex: number, attribute: string): boolean => {
    const record: Data = this.getRecord(recordIndex);
    if (record === undefined) {
      console.log('>>>>>get records', this.records());
    }
    if (record._orig && record._orig[attribute]) {
      return record[attribute] !== record._orig[attribute];
    }
    return false;
  };

  isStoreDirty = (): boolean => {
    const recs = this.records();
    const originalRecs = this.originalRecords();
    if (originalRecs == null) {
      let dirty = false;
      for (let record of recs) {
        if (record._rs === 'I') {
          dirty = true;
          break;
        }
      }
      return dirty;
    }
    return JSON.stringify(recs) !== JSON.stringify(originalRecs);
  };

  isRecordDirty = (index: number): boolean => {
    const rec = this.getRecord(index);
    const originalRec = this.getoriginalRecord(index);
    if (originalRec === null || originalRec === undefined) {
      return false;
    }
    return JSON.stringify(rec) !== JSON.stringify(originalRec);
  };

  setCurrentRecordIndex = (index: number) => {
    if (index >= this.records().length) {
      throw Error(
        `Developer ErrorIndex [${index}] being set as current record index cannot be more than the total records [${
          this.records().length
        }]! ${this.alias}`
      );
    }
    this.set(this.currentRecordIndexPath, index);
  };

  currentRecordIndex = (): number => {
    return this.get(this.currentRecordIndexPath);
  };

  reset = () => {
    this.setRecords(this.get(this.originalRecordsPath));
  };

  resetCurrentRecord = () => {
    const idx: number = this.get(this.currentRecordIndexPath);
    this.resetRecord(idx);
  };

  deleteCurrentRecord = () => {
    const idx: number = this.get(this.currentRecordIndexPath);
    this.delete(idx);
  };

  resetRecord = (index: number) => {
    const originalRecord = this.getoriginalRecord(index);
    this.setRecord(index, originalRecord);
  };

  setBusy = (busy: boolean) => {
    this.set(this.isBusyPath, busy);
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
    this.setBusy(true);
    await post(reqBody)
      .then((response) => {
        this.setRecords(response[this.alias].data);
        this.set(this.originalRecordsPath, response[this.alias].data);
        this.setBusy(false);
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

  insertRecord = (partialRecord: any) => {
    this.recordAction({
      store: this,
      actionType: 'I',
      index: -1,
      partialRecord,
    });
  };

  updateFromServer = (recIndex: number, record: Data) => {
    this.setOriginalRecord(recIndex, record);
    this.setRecord(recIndex, record);
  };

  //todo-locking
  updateRecords = (serverRecords: Data[]) => {
    const storeRecords: Data[] = this.records();
    const dirtyRecords = this.dirtyRecords();
    const size = dirtyRecords.length;
    for (let i = 0; i < size; i++) {
      const dirtyRec: Data = dirtyRecords[i];
      const recIndex = storeRecords.indexOf(dirtyRec);
      if (recIndex !== undefined && recIndex !== -1) {
        const currentRecord: any = this.getRecord(recIndex);
        if (currentRecord._rs === 'D') {
          this.deleteFromStore(recIndex);
        } else {
          if (serverRecords.length > i) {
            this.updateFromServer(recIndex, serverRecords[i]);
          }
        }
      }
    }
    this.setBusy(false);
  };

  dirtyRecords = () => {
    let dirtyRecords = this.records().filter(
      (record: any) => record._rs !== 'Q' && record._rs !== 'N'
    );
    return dirtyRecords;
  };

  isBusy = (): boolean => {
    return this.get(this.isBusyPath);
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
    this.setBusy(true);

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

    if (this.currentRecordIndex() === index) {
      const next = index + 1;
      const records = this.records();
      // .filter(
      //   (record: Data) => record._rs !== 'D',
      // );
      if (next < records.length) {
        this.setCurrentRecordIndex(next);
      } else {
        this.setCurrentRecordIndex(-1);
      }
    }
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
