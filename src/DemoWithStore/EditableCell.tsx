//@ts-nocheck
import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';

const styles = {
  input1: {
    height: 50,
  },
  input2: {
    height: 200,
    fontSize: '3em',
  },
};

const EditableCell = (props: any) => {
  // console.log('...props in cell', props);
  const [val, setVal] = useState(props.cellData.value);
  useEffect(() => {
    setVal(props.cellData.value);
  }, [props.cellData.value]);
  const { disabled, value } = props.cellData;

  const isAttrDirty = props.isAttributeDirty(
    props.cellData.id,
    props.cellData.type,
  );
  const dirtyClass = isAttrDirty ? 'dirtyCell' : null;
  return (
    <td>
      {disabled ? (
        <div> {value} </div>
      ) : (
        // <input
        //   className={style}
        //   type='text'
        //   name={props.cellData.type}
        //   id={props.cellData.id}
        //   value={val}
        //   onBlur={(e) => props.onEmployeeTableUpdate(e)}
        //   onChange={(e) => {
        //     setVal(e.target.value);
        //   }}
        //   disabled={disabled}
        // />
        <TextField
          id='outlined-basic'
          value={val}
          size='small'
          className={dirtyClass}
          variant='outlined'
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
