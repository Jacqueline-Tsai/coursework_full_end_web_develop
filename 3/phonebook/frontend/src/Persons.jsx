import React from 'react';

const Persons = (props) => {
  const personMatchesFilter = (person) => {
    return person.name.toLowerCase().includes(props.filter.toLowerCase());
  };

  const deletePerson = (person) => {
    if (confirm("Delete " + person.name  +  " ?") == true) {
      props.deletePerson(person);
    }
  };

  return (
    <div>
      {props.persons.filter(personMatchesFilter).map(person => (
        <div key={person.id}>
          {person.name} {person.number}
          <button onClick={() => {deletePerson(person)}}>delete</button>
        </div>
      ))}
    </div>
  );
}

export default Persons;