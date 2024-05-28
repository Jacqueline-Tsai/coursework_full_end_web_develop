import React, { useState } from 'react';

const Filter = (props) => {
  const [filter, setFilterInput] = useState('');

  const handleFilterChange = (event) => {
    const filterValue = event.target.value;
    setFilterInput(filterValue);
    props.setFilter(filterValue); 
  }

  return (
    <div>
      filter shown with: <input value={filter} onChange={handleFilterChange} />
    </div>
  );
}

export default Filter;
