import { useState } from 'react'
import Header from './Header'
import Button from './Button'
import Anecdotes from './Anecdotes'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const [votes, setVotes] = useState({
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0
  })
   
  const [selected, setSelected] = useState(0)
  const [mostVoted, setMostVoted] = useState(0)

  const handleVoteClick = () => {
    const newVotes = { 
      ...votes, 
      [selected]: votes[selected] + 1 // Update vote count for the selected anecdote
    };
    setVotes(newVotes);
    
    let maxVal = 0;
    let maxIndex = mostVoted;
    for (let i in newVotes) {
      if (newVotes[i] > maxVal) {
        maxVal = newVotes[i];
        maxIndex = i;
      }
    }
    setMostVoted(maxIndex);
  }

  return (
    <div>
      <Header text="Anecdote of the day"/>
      <Anecdotes anecdote={anecdotes[selected]} vote={votes[selected]}/>
      <Button text="vote" onClick={handleVoteClick}/>
      <Button text="next anecdote" onClick={() => setSelected((selected + 1) % anecdotes.length)}/>
      <Header text="Anecdote with the most votes"/>
      <Anecdotes anecdote={anecdotes[mostVoted]} vote={votes[mostVoted]}/>
    </div>
  )
}

export default App