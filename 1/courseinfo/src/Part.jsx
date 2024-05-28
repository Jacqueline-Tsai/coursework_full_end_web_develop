import React from 'react';

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercise}
    </p>
  );
}

export default Part