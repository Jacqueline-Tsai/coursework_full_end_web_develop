import React from 'react';

const Anecdotes = (props) => {
  return (
    <div>
      {props.anecdote} <br />
      has {props.vote} votes
    </div>
  );
}

export default Anecdotes