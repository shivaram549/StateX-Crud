import React from 'react';
import EditableCell from './EditableCell';

const ProductRow = (props) => {
  console.log('props', props);
  const onDelEvent = () => {
    props.onDelEvent(props.product);
  };
  return (
    <div>
      <tr>
        <EditableCell
          onProductTableUpdate={props.onProductTableUpdate}
          cellData={{
            type: 'name',
            value: props.product.name,
            id: props.product.id,
          }}
        />
        <EditableCell
          onProductTableUpdate={props.onProductTableUpdate}
          cellData={{
            type: 'price',
            value: props.product.price,
            id: props.product.id,
          }}
        />
        <EditableCell
          onProductTableUpdate={props.onProductTableUpdate}
          cellData={{
            type: 'qty',
            value: props.product.qty,
            id: props.product.id,
          }}
        />
        <EditableCell
          onProductTableUpdate={props.onProductTableUpdate}
          cellData={{
            type: 'category',
            value: props.product.category,
            id: props.product.id,
          }}
        />
        <td className='del-cell'>
          <input
            type='button'
            onClick={onDelEvent}
            value='X'
            className='del-btn'
          />
        </td>
      </tr>
    </div>
  );
};

export default ProductRow;
