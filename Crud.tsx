import React from 'react';
import {
  useStateX,
  useStateXValueSetter,
  useStateXValue,
} from '@cloudio/statex';
import { employeeListAtom, employeeGenderAtom } from './state';
import EmpList from './EmpList';
import { Employee } from './types';

function Crud() {
  const employees = useStateXValue(employeeListAtom);
  const employee_name_path = ['employee', 'name'];
  const employee_bloodGroup_path = ['employee', 'bloodGroup'];

  const [name, setName] = useStateX(employee_name_path, '');
  const [gender, setgender] = useStateX(employeeGenderAtom);
  const [bloodGroup, setbloodGroup] = useStateX(employee_bloodGroup_path, '');

  const setEmpList = useStateXValueSetter(employeeListAtom);

  const addEmployee = () => {
    setEmpList((oldEmpList) => [
      ...oldEmpList,
      {
        id: getId(),
        name,
        gender,
        bloodGroup,
      },
    ]);
  };

  return (
    <>
      <label htmlFor='name'>Name:</label>
      <input
        type='text'
        id='name'
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder='Enter name'
      />

      <label htmlFor='gender'>Gender:</label>
      <input
        type='text'
        id='gender'
        value={gender}
        onChange={(e) => setgender(e.target.value)}
        placeholder='Enter gender'
      />

      <label htmlFor='bloodGroup'>BloodGroup:</label>
      <input
        type='text'
        id='bloodGroup'
        value={bloodGroup}
        onChange={(e) => setbloodGroup(e.target.value)}
        placeholder='Enter blood group'
      />

      <button onClick={addEmployee}> Add Employee</button>
      <br />
      <br />
      {employees.map((employee: Employee, index: number) => {
        return <EmpList index={index} employee={employee} />;
      })}
    </>
  );
}

let id = 3;
function getId() {
  return id++;
}
export default Crud;
