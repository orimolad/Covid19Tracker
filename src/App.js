import React, { useState, useEffect } from 'react';
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core"
import Infobox from './Infobox';
import Map from "./Map";
import Table from "./Table";
import {sortData, prettyPrintStat} from "./Util";
import Linegraph from "./Linegraph";
import "leaflet/dist/leaflet.css";
import './App.css';


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState('cases')

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
    });
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          // console.log(data)
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
            
          }));
          const sortedData = sortData(data)
          setTableData(sortedData)
          setCountries(countries);
          setMapCountries(data);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
console.log(countryCode)
    const url = 
      countryCode === "worldwide" 
      ? "https://disease.sh/v3/covid-19/all" 
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setInputCountry(countryCode);
      setCountryInfo(data);
      console.log(data)
      // setMapCenter([data.countryInfo.lat, data.countryInfo.long])
      setMapCenter([data.countryInfo.lat, data.countryInfo.long])
      // { lat: 34.80746, lng: -40.4796 }
      // {/* having trouble to get the map to move to the right place onClick */ }


      setMapZoom(6)
    });
  };


  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map(country => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <Infobox 
            isRed 
            active={casesType === 'cases'} 
            onClick={(e) => setCasesType('cases')} 
            title="Coronavirus Cases" 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStat(countryInfo.cases)} 
          />
          <Infobox 
            active={casesType === 'recovered'} 
            onClick={(e) => setCasesType('recovered')} 
            title="Recovered" 
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={prettyPrintStat(countryInfo.recovered)} 
          />
          <Infobox 
            isRed 
            active={casesType === 'deaths'} 
            onClick={(e) => setCasesType('deaths')} 
            title="Deaths" 
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={prettyPrintStat(countryInfo.deaths)} 
          />
        </div>
        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
      </div>
     <Card className="app__right">
       <CardContent>
         <h3>Live Cases by Country</h3>
         <Table countries={tableData} />
              <h3>Worldwide new {casesType}</h3>
        <Linegraph className="app__graph" casesType={casesType}/>
        </CardContent>
     </Card>
    </div>
  );
}

export default App;

