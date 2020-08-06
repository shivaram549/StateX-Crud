import React from 'react';

const SearchBar = (props) => {
  const handleChange = (e) => {
    props.onUserInput(e.target.value);
  };
  return (
    <div>
      <input
        type='text'
        placeholder='Search with name...'
        value={props.filterText}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;
