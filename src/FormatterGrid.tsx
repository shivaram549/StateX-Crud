//@ts-nocheck
import React, { useState } from 'react';
import ReactDataGrid from 'react-data-grid';
import Editor from './Editor';
const columns = [
  { key: 'id', name: 'ID', editable: true, editor: Editor },
  { key: 'title', name: 'Title', editable: true },
  { key: 'complete', name: 'Complete', editable: true },
];

const rows1 = [
  { id: 0, title: 'Task 1', complete: 20 },
  { id: 1, title: 'Task 2', complete: 40 },
  { id: 2, title: 'Task 3', complete: 60 },
];

export default function Example() {
  const [rows, setRows] = useState(rows1);

  const onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    console.log('onGridRowsUpdated');
    const rowsCopy = rows.slice();
    for (let i = fromRow; i <= toRow; i++) {
      rowsCopy[i] = { ...rowsCopy[i], ...updated };
    }
    setRows(rowsCopy);
  };

  const RowRenderer = ({ row, idx }) => {
    return (
      <div className='rdg-row rdg-row-even' style={{ top: '50px' }}>
        <div class='rdg-cell' style={{ width: '500px', left: '0px' }}>
          {row.id}
        </div>
        <div className='rdg-cell' style={{ width: '500px', left: '500px' }}>
          {row.title}
        </div>
        <div className='rdg-cell' style={{ width: '500px', left: '1000px' }}>
          {row.complete}
        </div>
      </div>
    );
  };

  return (
    <ReactDataGrid
      columns={columns}
      onRowsUpdate={onGridRowsUpdated}
      rowRenderer={RowRenderer}
      rows={rows}
      rowGetter={(i) => rows[i]}
      rowsCount={rows.length}
      rowHeight={35}
    />
  );
}
