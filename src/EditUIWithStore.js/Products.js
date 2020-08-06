import React, { memo, useState } from 'react';
import ProductTable from './ProductTable';
import SearchBar from './SearchBar';

const Products = memo(() => {
  const [filterText, setFiltertext] = useState('');
  const [products, setProducts] = useState([
    {
      id: 1,
      category: 'Sporting Goods',
      price: '49.99',
      qty: 12,
      name: 'football',
    },
    {
      id: 2,
      category: 'Sporting Goods',
      price: '9.99',
      qty: 15,
      name: 'baseball',
    },
    {
      id: 3,
      category: 'Sporting Goods',
      price: '29.99',
      qty: 14,
      name: 'basketball',
    },
    {
      id: 4,
      category: 'Electronics',
      price: '99.99',
      qty: 34,
      name: 'iPod Touch',
    },
    {
      id: 5,
      category: 'Electronics',
      price: '399.99',
      qty: 12,
      name: 'iPhone 5',
    },
    {
      id: 6,
      category: 'Electronics',
      price: '199.99',
      qty: 23,
      name: 'nexus 7',
    },
  ]);

  const handleUserInput = (filterText) => {
    setFiltertext(filterText);
  };

  const handleRowDel = (product) => {
    var index = products.indexOf(product);

    setProducts(products.filter((item) => item.name !== product.name));
  };

  const handleAddEvent = (evt) => {
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    var product = {
      id: id,
      name: '',
      price: '',
      category: '',
      qty: 0,
    };
    setProducts((state) => [...state, product]);
  };

  const handleProductTable = (evt) => {
    var item = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value,
    };
    var productsArray = products.slice();
    var newProducts = productsArray.map(function (product) {
      for (var key in product) {
        if (key == item.name && product.id == item.id) {
          product[key] = item.value;
        }
      }
      return product;
    });
    setProducts(newProducts);
  };

  return (
    <>
      <SearchBar filterText={filterText} onUserInput={handleUserInput} />
      <ProductTable
        onProductTableUpdate={handleProductTable}
        onRowAdd={handleAddEvent}
        onRowDel={handleRowDel}
        products={products}
        filterText={filterText}
      />
    </>
  );
});

export default Products;
