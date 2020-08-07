import React from 'react';
import EmployeeRow from './EmployeeRow';

const EmployeeTable = (props: any) => {
  const rowDel = props.onRowDel;
  const onSaveEvent = props.onSaveEvent;

  const employee = props.employees.map(function (employee: any, index: number) {
    return (
      <EmployeeRow
        isRecordDirty={props.isRecordDirty}
        onUpdate={props.onUpdate}
        onEmployeeTableUpdate={props.onEmployeeTableUpdate}
        employee={employee}
        onDelEvent={rowDel}
        onSaveEvent={onSaveEvent}
        id={index}
        key={index}
        // key={employee._id}
        isAttributeDirty={props.isAttributeDirty}
        setCurrentRecordIndex={props.setCurrentRecordIndex}
      />
    );
  });
  return (
    <>
      <table
        className='table table-bordered'
        style={{ marginTop: '50px', width: '50%' }}>
        <thead>
          <tr>
            <th>_id</th>
            <th>name</th>
            <th>gender</th>
          </tr>
        </thead>

        <tbody>{employee}</tbody>
      </table>
    </>
  );
};

export default EmployeeTable;
