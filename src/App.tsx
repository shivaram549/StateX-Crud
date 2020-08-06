//@ts-nocheck
import React from 'react';
import { useStateX } from '@cloudio/statex';
// import EmloyeesUIWithStore from './EmloyeesUIWithStore';
// import DataGrid from './reactDataGrid';

import 'react-data-grid/dist/react-data-grid.css';

import './App.css';
// import Demo from './Demo';

import Employees from './DemoWithStore/Employees';
import './App.css';

function JSONPayload() {
  const [json] = useStateX([], []);

  return (
    <>
      <h4>Path Object</h4>
      <pre>{JSON.stringify(json, null, 2)}</pre>;
    </>
  );
}

function App() {
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
