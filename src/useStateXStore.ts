//@ts-nocheck
import { useStateXValue } from '@cloudio/statex';
import useDataStore from './useDataStore';

export default (ds: string, dsAlias: string) => {
  const store = useDataStore(ds, dsAlias);
  useStateXValue(store.recordsPath, []);

  return {
    query: store.query,
    insertRecordPartial: store.insertRecordPartial,
    updateRecord: store.updateRecord,
    deleteRecord: store.delete,
    dirtyRecords: store.dirtyRecords,
    save: store.save,
    records: store.records,
    isDirty: store.isDirty,
    isAttributeDirty: store.isAttributeDirty,
    reset: store.reset,
    resetRecord: store.resetRecord,
    isRecordDirty: store.isRecordDirty,
    isStoreDirty: store.isStoreDirty,
    getCurrentRecord: store.getCurrentRecord,
    setCurrentRecord: store.setCurrentRecord,
    createNew: store.createNew,
    currentRecord: store.getCurrentRecord,
  };
};
