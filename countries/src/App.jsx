import axios from 'axios'
import { useState, useEffect } from 'react'

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('United States')
  const [selectedCountry, setSelectedCountry] = useState({})

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all').then(response => {
      setCountries(response.data)
      console.log(response.data)
    })
  },[])
  console.log(selectedCountry)
  const filteredCountries = countries.filter(c => c.name.official.toLowerCase().includes(country.toLowerCase()))

  return (
    <div>
      <p>find countries</p>
      <input type="text" onChange={e => setCountry(e.target.value)} value={country}/>
      {filteredCountries.length === 1 ? 
        <Country 
        name = {filteredCountries[0].name.official}
        capital = {filteredCountries[0].capital}
        area = {filteredCountries[0].area}
        languages = {filteredCountries[0].languages}
        flag = {filteredCountries[0].flags.png}
        latlng = {filteredCountries[0].latlng}
        />
      : 
      filteredCountries.length > 10 ? <p>Too many matches, specify another filter</p> : 
      filteredCountries.map((country, i) => 
        <div key={i}>
          <h1 >{country.name.official}</h1>
          <button onClick={() => setSelectedCountry(filteredCountries[i])}>show</button>
          {country.name.official === selectedCountry.name?.official ?
            <Country
            name = {selectedCountry.name.official}
            capital = {selectedCountry.capital}
            area = {selectedCountry.area}
            languages = {selectedCountry.languages}
            flag = {selectedCountry.flags.png}
            latlng = {filteredCountries[0].latlng}
            />
          :<></>}
        </div>
      )}
    </div>
  )
}

const Country = ({name, capital, area, languages, flag, latlng}) => {
  const [weather, setWeather] = useState({})
  useEffect(() => {
    const options = {
      method: 'GET',
      url: 'https://weatherapi-com.p.rapidapi.com/current.json',
      params: {q: `${latlng[0]}, ${latlng[1]}`},
      headers: {
        'X-RapidAPI-Key': 'a0715b2590mshaadc1aa57d89665p15abf8jsne829c903270a',
        'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
      }
    };
      axios.request(options).then(response => setWeather(response.data))
  },[])

  return (
    <div>
      <p>capital {capital}</p>
      <p>area {area}</p>
      <h2>languages</h2>
      <ul>
        {Object.keys(languages).map(key => <li key={key}>{languages[key]}</li>)}
      </ul>
      <img src={flag} alt="flag" />
      <h2>Weather in {name}</h2>
      <p>temperature {weather?.current?.temp_c} Celsius </p>
      <img src={weather?.current?.condition?.icon} alt="weather" />
      <p>{weather?.current?.condition?.text}</p>

    </div>
  )
}

export default App

