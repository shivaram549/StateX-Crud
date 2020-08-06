// @ts-nocheck
import React from 'react';

import useStateXStore from '../useStateXStore';
import EmployeeTable from './EmployeeTable';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import RefreshIcon from '@material-ui/icons/Cached';
import PlusIcon from '@material-ui/icons/AddCircleOutline';
import RedoIcon from '@material-ui/icons/Redo';
import RestoreIcon from '@material-ui/icons/Restore';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      '& > * + *': {
        marginLeft: theme.spacing(2),
      },
    },
    button: {
      textTransform: 'none',
      marginLeft: 10,
    },
  })
);

export default function Demo() {
  const ds = 'app-employees';
  const alias = 'employeesStore';
  const {
    deleteRecord,
    query,
    createNew,
    insertRecord,
    updateRecord,
    records,
    save,
    isStoreDirty,
    isAttributeDirty,
    reset,
    resetCurrentRecord,
    isRecordDirty,
    currentRecord,
    isBusy,
    setCurrentRecordIndex,
    currentRecordIndex,
  } = useStateXStore(ds, alias);

  const onSave = () => {
    save();
  };
  const dis = !isStoreDirty();

  const handleAddEvent = (evt) => {
    createNew({});
  };

  const handleReset = () => {
    reset();
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

  const onUpdate = (index: number, partialRecord: any) => {
    updateRecord(index, partialRecord);
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
    insertRecord(partialRecord);
  };

  const employees: any = records().filter((record: any) => record._rs !== 'D');

  const refresh = () => {
    const filter = { _deleted: 'N' };
    query(filter);
  };

  const setCurrentRecordIndexVal = (index: number) => {
    console.log('>>index', index);
    setCurrentRecordIndex(index);
  };

  const classes = useStyles();

  return (
    <>
      <Button
        variant='contained'
        color='secondary'
        className={classes.button}
        startIcon={<DeleteIcon />}>
        Delete
      </Button>

      <Button
        variant='contained'
        color='primary'
        className={classes.button}
        onClick={onSave}
        disabled={dis}
        startIcon={<SaveIcon />}>
        Save
      </Button>

      <Button
        variant='contained'
        color='default'
        className={classes.button}
        onClick={refresh}
        startIcon={<RefreshIcon />}>
        Refresh
      </Button>

      <Button
        variant='contained'
        color='default'
        className={classes.button}
        onClick={handleAddEvent}
        startIcon={<PlusIcon />}>
        Add
      </Button>

      <Button
        variant='contained'
        color='default'
        className={classes.button}
        onClick={handleReset}
        startIcon={<RedoIcon />}>
        Reset All
      </Button>

      <Button
        variant='contained'
        color='default'
        className={classes.button}
        onClick={() => resetCurrentRecord()}
        startIcon={<RestoreIcon />}>
        Reset Current Record
      </Button>
      <br />
      <br />
      {currentRecord}
      <br />
      <div className={classes.root}>
        {isBusy() ? <CircularProgress /> : null}
      </div>
      <div>currentRecordIndex: {currentRecordIndex()}</div>

      <EmployeeTable
        isRecordDirty={isRecordDirty}
        onUpdate={onUpdate}
        onEmployeeTableUpdate={handleEmployeeTable}
        onRowAdd={handleAddEvent}
        onRowDel={handleRowDel}
        onSaveEvent={onSaveEvent}
        employees={employees}
        isAttributeDirty={isAttributeDirty}
        onReset={onReset}
        onResetRecord={onResetRecord}
        setCurrentRecordIndex={setCurrentRecordIndexVal}
      />
    </>
  );
}
