import React, { useState } from 'react';
import { useStateX, useStateXValueRemover } from '@cloudio/statex';
import { Employee } from './types';

function EmpList({ employee, index }: { employee: Employee; index: number }) {
  const [editing, setEditing] = useState(false);

  console.log(
    'path',
    useStateX(['employee', 'list', ':index'], '', {
      params: { index },
    })
  );
  const [name, setName] = useStateX(
    ['employee', 'list', ':index', 'name'],
    '',
    {
      params: { index },
    }
  );

  const [gender, setGender] = useStateX(
    ['employee', 'list', ':index', 'gender'],
    '',
    {
      params: { index },
    }
  );
  const [bloodGroup, setBloodGroup] = useStateX(
    ['employee', 'list', ':index', 'bloodGroup'],
    '',
    {
      params: { index },
    }
  );

  const deleteEmpl = useStateXValueRemover(['employee', 'list', ':index'], {
    params: { index },
  });

  return (
    <>
      {!editing ? (
        <div>
          <br />
          <label
            onClick={() => {
              setEditing(true);
            }}>
            name: {employee.name}
          </label>
          <br />
          <label onClick={() => setEditing(true)}>age: {employee.gender}</label>
          <br />
          <label onClick={() => setEditing(true)}>
            bloodGroup: {employee.bloodGroup}
          </label>
          <br />
        </div>
      ) : (
        <div>
          <input onChange={(e) => setName(e.target.value)} value={name} />
          <input onChange={(e) => setGender(e.target.value)} value={gender} />
          <input
            onChange={(e) => setBloodGroup(e.target.value)}
            value={bloodGroup}
          />
          <br />
          <button onClick={() => setEditing(false)}>FinishedEditing</button>
        </div>
      )}

      <button onClick={deleteEmpl}>Delete</button>
    </>
  );
}

export default EmpList;
