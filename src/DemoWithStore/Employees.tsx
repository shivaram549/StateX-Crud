// @ts-nocheck
import React from 'react';

import useStateXStore from '../useStateXStore';
import EmployeeTable from './EmployeeTable';

export default function Demo() {
  const ds = 'app-employees';
  const alias = 'employeesStore';
  const {
    deleteRecord,
    query,
    createNew,
    insertRecordPartial,
    updateRecord,
    records,
    save,
    isDirty,
    isAttributeDirty,
  } = useStateXStore(ds, alias);
  const saveClick = () => {
    save();
  };

  const handleAddEvent = (evt) => {
    createNew({});
  };

  const handleEmployeeTable = (evt) => {
    const partialRecord = {};
    if (evt.target.name === 'name') {
      partialRecord.name = evt.target.value;
    }
    if (evt.target.name === 'gender') {
      partialRecord.gender = evt.target.value;
    }
    updateRecord(parseInt(evt.target.id), partialRecord);
  };

  const handleRowDel = (id) => {
    deleteRecord(parseInt(id));
  };
  const onReset = (id) => {};
  const onResetRecord = (id) => {};

  const onSaveEvent = (props) => {
    const { employee } = props;
    const partialRecord = { name: employee.name, gender: employee.gender };
    console.log('>rpops', partialRecord);
    insertRecordPartial(partialRecord);
  };

  const employees: any = records().filter((record: any) => record._rs !== 'D');

  const refresh = () => {
    const filter = { _deleted: 'N' };
    query(filter);
  };

  return (
    <>
      <button style={{ marginLeft: '10px' }} onClick={refresh}>
        Refresh
      </button>
      <button style={{ marginLeft: '10px' }} onClick={saveClick}>
        Save
      </button>

      <button
        type='button'
        style={{ marginLeft: '10px' }}
        onClick={handleAddEvent}>
        Add
      </button>
      <button type='button' style={{ marginLeft: '10px' }}>
        Reset All
      </button>
      <button type='button' style={{ marginLeft: '10px' }}>
        Reset Current Record
      </button>

      <EmployeeTable
        onEmployeeTableUpdate={handleEmployeeTable}
        onRowAdd={handleAddEvent}
        onRowDel={handleRowDel}
        onSaveEvent={onSaveEvent}
        employees={employees}
        isAttributeDirty={isAttributeDirty}
        onReset={onReset}
        onResetRecord={onResetRecord}
      />
    </>
  );
}
