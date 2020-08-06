//@ts-nocheck
import React from 'react';
import { useStateX } from '@cloudio/statex';
// import EmloyeesUIWithStore from './EmloyeesUIWithStore';
// import DataGrid from './reactDataGrid';
import DataGrid from 'react-data-grid';
import 'react-data-grid/dist/react-data-grid.css';
import Example from './FormatterGrid';
import './App.css';
// import Demo from './Demo';
import ReactEditableTable from './ReactEditableTable';
import HelloWorld from './HelloWorld';
import { useState } from 'react';
import Main from './MaterialTable';
import ReactTable from './ReactTable';
import Products from './EditUIWithStore.js/Products';
import Employees from './DemoWithStore/Employees';
import './App.css';

function JSONPayload() {
  const json = useStateX([], []);
  // useStateXValue(['employee', 'list'], []);
  return (
    <>
      <h4>Path Object</h4>
      <pre>{JSON.stringify(json, null, 2)}</pre>;
    </>
  );
}

const columns = [
  { key: 'id', name: 'ID', editable: true },
  { key: 'title', name: 'Title', editable: true },
];

const rows1 = [
  { id: 0, title: 'Example' },
  { id: 1, title: 'Demo' },
];

function App() {
  const [rows, setRows] = useState(rows1);
  const onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    const rows = rows.slice();
    for (let i = fromRow; i <= toRow; i++) {
      rows[i] = { ...rows[i], ...updated };
    }
    setRows(rows);
    return { rows };

    // setRows((state) => {
    //   const rows = state.rows.slice();
    //   for (let i = fromRow; i <= toRow; i++) {
    //     rows[i] = { ...rows[i], ...updated };
    //   }
    //   return { rows };
    // });
  };
  return (
    <>
      <div style={{ marginLeft: '100px' }}>
        <h2>Demo Employees Grid</h2>
        {/* <ReactEditableTable /> */}
        {/* <Products /> */}
        <Employees />
        <JSONPayload />
      </div>
    </>
  );
}

export default App;
