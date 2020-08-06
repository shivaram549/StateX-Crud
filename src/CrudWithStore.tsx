import React from 'react';
import { useStateXSetter, useStateXGetter, useStateX } from '@cloudio/statex';
import {
  addEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
} from './crudState';

function CrudWithStore() {
  useStateX(['employee', 'list'], []);

  const get = useStateXGetter();
  const set = useStateXSetter();

  const employees: any = getEmployees(get);

  console.log('iin render');

  console.log('employees', employees);

  return (
    <>
      {employees.map((employee: any) => {
        if (employee._rs === 'D') {
          return null;
        }
        return (
          <div key={employee.id}>
            index : {employee.id} <br />
            name : {employee.name}
            status : {employee._rs}
            <br />
            <button
              onClick={() =>
                updateEmployee(employee, { name: 'shiva dumb' }, set, get)
              }>
              Update Employee
            </button>{' '}
            <br />
            <button onClick={() => deleteEmployee(employee, set, get)}>
              Delete Employee
            </button>
            <br />
            <br />
          </div>
        );
      })}
      <button onClick={() => addEmployee('testName', set)}>Add Employee</button>
    </>
  );
}

let id = 3;
function getId() {
  return id++;
}

export default CrudWithStore;
