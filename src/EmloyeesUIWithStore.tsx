export {};
// import React from 'react';
// import { useStateXSetter, useStateXGetter, useStateX } from '@cloudio/statex';
// import {
//   addEmployee,
//   getEmployees,
//   updateEmployee,
//   deleteEmployee,
// } from './crudState';
// import { getDataStore } from './Store';

// function EmloyeesUIWithStore() {
//   useStateX(['employee', 'list'], []);
//   const ds = 'app-employees';
//   const alias = 'employeesStore';
//   const get = useStateXGetter();
//   const set = useStateXSetter();
//   const store = getDataStore(ds, alias, set, get);

//   const employees: any = store.getRecords();

//   console.log('iin render');

//   console.log('employees', employees);

//   return (
//     <>
//       <h4>Emlpoyees Store</h4>
//       <button onClick={() => store.query()}>Fetch Employees</button>
//       {employees.map((employee: any) => {
//         if (employee._rs === 'D') {
//           return null;
//         }
//         return (
//           <div key={employee._id}>
//             {employee._rs !== 'Q' ? <div>**Modified**</div> : null} <br />
//             index : {employee._id} <br />
//             name : {employee.name} <br />
//             status : {employee._rs} <br />
//             _deleted: {employee._deleted}
//             <br />
//             <label>Name</label>
//             <input id={employee._id} />
//             <button
//               onClick={() => {
//                 //@ts-ignore
//                 const val = document.getElementById(employee._id).value;
//                 store.updateRecord(employees.indexOf(employee), val);
//               }}>
//               Update Employee
//             </button>{' '}
//             <br />
//             <button onClick={() => store.delete(employees.indexOf(employee))}>
//               Delete Employee
//             </button>
//             <br />
//             <br />
//           </div>
//         );
//       })}
//       <button onClick={() => store.save()}>Save Employee</button>
//     </>
//   );
// }

// export default EmloyeesUIWithStore;
