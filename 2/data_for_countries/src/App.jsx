import { useState, useEffect } from 'react'
import countriesService from './services/countries'

const App = () => {
  const [filter, setFilter] = useState('');
  const [allCountries, setAllCountries] = useState([]);
  const [showedCountries, setShowedCountries] = useState([]);
  useEffect(() => {
    getAllCountries();
  }, []);

  const handleFilterChange = (event) => {
    const filterValue = event.target.value;
    setFilter(filterValue)
    setShowedCountries(
      allCountries.filter((country) => {
        return country.name.common.toLowerCase().includes(filterValue.toLowerCase());
      })
    )
  }

  const getAllCountries = () => {
    countriesService
      .getAll()
      .then(response => {
        setAllCountries(response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }
  
  const showCountry = (country) => {

  }

  if (showedCountries.length === 0 || showedCountries.length === allCountries.length) {
    return (
      <div>
        find countries <input value={filter} onChange={handleFilterChange} />
      </div>
    )
  }

  if (showedCountries.length > 10) {
    return (
      <div>
        find countries <input value={filter} onChange={handleFilterChange} /> <br/>
        Too many matches, specify another filter
      </div>
    )
  }

  if (showedCountries.length > 1) {
    return (
      <div>
        find countries <input value={filter} onChange={handleFilterChange} />
        {
          showedCountries.map((country, index) => (
            <div key={index}>
              {country.name.common}
              <button onClick={() => {setShowedCountries([country])}}>show</button>
            </div>
          ))
        }
      </div>
    )
  }

  if (showedCountries.length === 1) {
    return (
      <div>
        find countries <input value={filter} onChange={handleFilterChange} />
        <h2> {showedCountries[0].name.common} </h2>
        capital {showedCountries[0].capital} <br/>
        area {showedCountries[0].area} <br/>
        <h4> languages: </h4>
        {
          Object.entries(showedCountries[0].languages)
          .map(([key, value]) => (
            <div key={key}>
              {value} <br/>
            </div>
          ))
        }
        <h1>{showedCountries[0].flag}</h1>
      </div>
    )
  }

  return (
    <div>
      find countries <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

export default App