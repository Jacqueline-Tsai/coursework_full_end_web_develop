import { useState, useEffect } from 'react'
import Notification from "./Notification"
import Filter  from "./Filter"
import PersonForm  from "./PersonForm"
import Persons  from "./Persons"
import personService from './services/persons'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('');
  const [successMsg, setSuccessMsg] = useState(null); 
  const [errorMsg, setErrorMsg] = useState(null); 

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const setNotification = (_status, msg) => {
    if (_status == "success") {
      setSuccessMsg(msg)
      setErrorMsg(null)
    }
    else if (_status == "error") {
      setSuccessMsg(null)
      setErrorMsg(msg)
    }
  }

  const addPerson = (newPerson) => {
    let nameExist = false
    persons.forEach((value, index, array) => {
      if (value.name == newPerson.name) {
        let id = value.id
        if (confirm(newPerson.name + " is already added to phonebook, replace the old number with a new one?")) {
          personService
            .update(id, newPerson)
            .then(response => {
              setPersons(persons.map(person => person.id === id ? response.data : person))
              setNotification("success", "Updated " + newPerson.name)
          })
        }
        nameExist = true
      }
    });
    if (!nameExist) {
      newPerson.id = Math.max(0, Math.max(...persons.map(p => p.id)) + 1).toString();
      personService
        .create(newPerson)
        .then(response => {
          setPersons([...persons, newPerson]);
          setNotification("success", "Added " + newPerson.name)
      })
    }
  }

  const deletePerson = (person) => {
    personService
      .delete(person.id)
      .then(response => {
        setPersons(persons.filter(p => p.id !== person.id))  
      })
      .catch(error => {
        console.log(error)
        setNotification("error", "Information of " + person.name + " has already been removed from server")
      })
  }
  
  return (
    <div>
      <h2>Phonebook</h2>

      <Notification successMsg={successMsg} errorMsg={errorMsg} />

      <Filter setFilter={setFilter}/>

      <h3>Add a new</h3>

      <PersonForm addPerson={addPerson} />

      <h3>Numbers</h3>

      <Persons persons={persons} filter={filter} deletePerson={deletePerson}/>
    </div>
  )
}

export default App