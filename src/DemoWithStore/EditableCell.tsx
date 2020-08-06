//@ts-nocheck
import React, { useState } from 'react';

const EditableCell = (props: any) => {
  // console.log('...props in cell', props);
  const [val, setVal] = useState(props.cellData.value);
  const { disabled } = props.cellData;

  const isAttrDirty = props.isAttributeDirty(
    props.cellData.id,
    props.cellData.type,
  );
  const style = isAttrDirty ? 'dirtyCell' : null;
  return (
    <td>
      <input
        className={style}
        type='text'
        name={props.cellData.type}
        id={props.cellData.id}
        value={val}
        onBlur={(e) => props.onEmployeeTableUpdate(e)}
        onChange={(e) => {
          setVal(e.target.value);
        }}
        disabled={disabled}
      />
    </td>
  );
};

export default EditableCell;
