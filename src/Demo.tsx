// @ts-nocheck
import React, { useState } from 'react';
import { EditingState } from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableEditRow,
  TableEditColumn,
} from '@devexpress/dx-react-grid-material-ui';
import { Button } from '@material-ui/core';
import useStateXStore from './useStateXStore';

//todo performance optimization using usememo|usecallback
export default function Demo() {
  const ds = 'app-employees';
  const alias = 'employeesStore';
  const {
    deleteRecord,
    query,
    insertRecord,
    updateRecord,
    records,
    save,
    isDirty,
  } = useStateXStore(ds, alias);

  const saveClick = () => {
    save();
  };

  const refresh = () => {
    const filter = { _deleted: 'N' };
    query(filter);
  };

  const disabled = !isDirty();

  const rows: any = records().filter((record: any) => record._rs !== 'D');

  const [editingStateColumnExtensions] = useState([
    { columnName: '_id', editingEnabled: false },
  ]);

  const commitChanges = ({ added, changed, deleted }) => {
    if (added) {
      Object.keys(added).forEach((key) => {
        insertRecord(added[key]);
      });
    }
    if (changed) {
      Object.keys(changed).forEach((key) => {
        updateRecord(parseInt(key), changed[key]);
      });
    }
    if (deleted) {
      Object.keys(deleted).forEach((key) => {
        deleteRecord(parseInt(deleted[key]));
      });
    }
  };

  const columns = [
    { name: '_id', title: 'Id' },
    { name: 'name', title: 'Name' },
    { name: 'gender', title: 'Gender' },
  ];

  return (
    <>
      {/* <h4>State Values</h4>
      <pre>{JSON.stringify(json, null, 2)}</pre>; */}
      <Button
        style={{ marginLeft: '50px' }}
        onClick={refresh}
        variant='outlined'
        color='primary'>
        Refresh
      </Button>

      <Button
        style={{ marginLeft: '50px' }}
        onClick={saveClick}
        variant='outlined'
        color='secondary'
        disabled={disabled}>
        Save
      </Button>
      <Grid rows={rows} columns={columns}>
        <EditingState
          onCommitChanges={commitChanges}
          columnExtensions={editingStateColumnExtensions}
        />
        <Table />
        <TableHeaderRow />
        <TableEditRow />
        <TableEditColumn showAddCommand showEditCommand showDeleteCommand />
      </Grid>
    </>
  );
}
