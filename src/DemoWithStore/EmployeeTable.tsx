import React from 'react';
import EmployeeRow from './EmployeeRow';

const EmployeeTable = (props: any) => {
  const rowDel = props.onRowDel;
  const onSaveEvent = props.onSaveEvent;
  const ononReset = props.onReset;
  const onResetRecord = props.onResetRecord;

  const employee = props.employees.map(function (employee: any, index: number) {
    return (
      <EmployeeRow
        onEmployeeTableUpdate={props.onEmployeeTableUpdate}
        employee={employee}
        onDelEvent={rowDel}
        onSaveEvent={onSaveEvent}
        id={index}
        key={index}
        isAttributeDirty={props.isAttributeDirty}
      />
    );
  });
  return (
    <>
      <table className='table table-bordered' style={{ marginTop: '50px' }}>
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
