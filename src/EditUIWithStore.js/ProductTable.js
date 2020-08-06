import React from 'react';
import ProductRow from './ProductRow';

const ProductTable = (props) => {
  const onProductTableUpdate = props.onProductTableUpdate;
  const rowDel = props.onRowDel;
  const filterText = props.filterText;
  const product = props.products.map(function (product) {
    if (product.name.indexOf(filterText) === -1) {
      return;
    }
    return (
      <ProductRow
        onProductTableUpdate={onProductTableUpdate}
        product={product}
        onDelEvent={rowDel}
        key={product.id}
      />
    );
  });
  return (
    <>
      <button type='button' onClick={props.onRowAdd}>
        Add
      </button>
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>Name</th>
            <th>price</th>
            <th>quantity</th>
            <th>category</th>
          </tr>
        </thead>

        <tbody>{product}</tbody>
      </table>
    </>
  );
};

export default ProductTable;
