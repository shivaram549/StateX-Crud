//@ts-nocheck
import { useStateXValue } from '@cloudio/statex';
import useDataStore from './useDataStore';

export default (ds: string, dsAlias: string) => {
  const store = useDataStore(ds, dsAlias);
  useStateXValue(store.recordsPath, []);
  useStateXValue(store.isBusyPath, false);
  useStateXValue(store.currentRecordIndexPath, false);

  return {
    query: store.query,
    insertRecord: store.insertRecord,
    updateRecord: store.updateRecord,
    deleteRecord: store.delete,
    dirtyRecords: store.dirtyRecords,
    save: store.save,
    records: store.records,
    isDirty: store.isDirty,
    isAttributeDirty: store.isAttributeDirty,
    reset: store.reset,
    resetRecord: store.resetRecord,
    resetCurrentRecord: store.resetCurrentRecord,
    isRecordDirty: store.isRecordDirty,
    isStoreDirty: store.isStoreDirty,
    getCurrentRecord: store.getCurrentRecord,
    setCurrentRecord: store.setCurrentRecord,
    createNew: store.createNew,
    currentRecord: store.getCurrentRecord,
    isBusy: store.isBusy,
    setCurrentRecordIndex: store.setCurrentRecordIndex,
    currentRecordIndex: store.currentRecordIndex,
  };
};
