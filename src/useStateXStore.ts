//@ts-nocheck
import { useStateXValue } from '@cloudio/statex';
import useDataStore from './useDataStore';

export default (ds: string, dsAlias: string) => {
  const store = useDataStore(ds, dsAlias);
  const currentRecordIndex = useStateXValue(
    store.currentRecordIndexPath,
    false
  );

  const isBusy = useStateXValue(store.isBusyPath, false);

  const records = useStateXValue(store.recordsPath, []);

  return {
    query: store.query,
    insertRecord: store.insertRecord,
    updateRecord: store.updateRecord,
    deleteRecord: store.delete,
    dirtyRecords: store.dirtyRecords,
    save: store.save,
    records,
    isAttributeDirty: store.isAttributeDirty,
    reset: store.reset,
    resetRecord: store.resetRecord,
    resetCurrentRecord: store.resetCurrentRecord,
    isRecordDirty: store.isRecordDirty,
    isStoreDirty: store.isStoreDirty,
    createNew: store.createNew,
    isBusy,
    setCurrentRecordIndex: store.setCurrentRecordIndex,
    currentRecordIndex,
    deleteCurrentRecord: store.deleteCurrentRecord,
  };
};
