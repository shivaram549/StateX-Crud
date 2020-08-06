//@ts-nocheck
import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';

const EditableCell = (props: any) => {
  const [val, setVal] = useState(props.cellData.value);
  useEffect(() => {
    setVal(props.cellData.value);
  }, [props.cellData.value]);
  const { disabled, value } = props.cellData;
  const setCurrentRecordIndexx = () => {
    props.setCurrentRecordIndex(props.cellData.id);
  };
  const isAttrDirty = props.isAttributeDirty(
    props.cellData.id,
    props.cellData.type
  );
  const dirtyClass = isAttrDirty ? 'dirtyCell' : null;
  return (
    <td>
      {disabled ? (
        <div> {value} </div>
      ) : (
        <TextField
          id='outlined-basic'
          value={val}
          size='small'
          className={dirtyClass}
          variant='outlined'
          onClick={setCurrentRecordIndexx}
          onChange={(e) => {
            setVal(e.target.value);
          }}
          onBlur={(e) =>
            props.onUpdate(props.cellData.id, { [props.cellData.type]: val })
          }
        />
      )}
    </td>
  );
};

export default EditableCell;
