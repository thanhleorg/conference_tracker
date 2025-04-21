import React, { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import yaml from 'js-yaml';
import Papa from 'papaparse';
import ConferenceCard from './ConferenceCard';
import logo2 from './t-rex.gif';
import './App.css';

function App() {
  const [conferences, setConferences] = useState([]);
  const [filteredConferences, setFilteredConferences] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      // Fetch and parse YAML data
      const yamlResponse = await fetch('/csconfs/data/conferences.yaml');
      const yamlText = await yamlResponse.text();
      const loadedConferences = yaml.load(yamlText);
      
      if (!Array.isArray(loadedConferences)) {
        throw new Error("The loaded data is not an array.");
      }

      // Fetch and parse CSV data
      const csvResponse = await fetch('/csconfs/data/conferences.csv');
      const csvText = await csvResponse.text();
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          const areasSet = new Set();
          results.data.forEach(row => {
            if (row.AreaTitle) {
              areasSet.add(row.AreaTitle);
            }
          });

          const areasArray = Array.from(areasSet);
          setAreas(areasArray);

          const enrichedConferences = loadedConferences
            .map(conf => {
              const matchingArea = results.data.find(row => row.ConferenceTitle === conf.name);
              return {
                ...conf,
                area_title: matchingArea ? matchingArea.AreaTitle : null,
              };
            })
            .filter(conf => conf.area_title !== null);

          setConferences(enrichedConferences);
          setFilteredConferences(enrichedConferences);
          setLoading(false);
        },
      });
    };

    fetchData();
  }, []);

  const filterConferences = () => {
    const areaArray = Array.from(selectedAreas);
    const updatedConferences = conferences.filter(conf => {
      const matchesArea = areaArray.length === 0 || areaArray.includes(conf.area_title);
      const matchesSearch = conf.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesArea && matchesSearch;
    });


    setFilteredConferences(updatedConferences.sort((a, b) => {
      return new Date(a.deadline) - new Date(b.deadline); // Sort by deadline
    }));
  };

  useEffect(() => {
    filterConferences(); // Filter when areas or search query changes
    // eslint-disable-next-line
  }, [selectedAreas, searchQuery, conferences]);

  const handleCheckboxChange = (areaTitle) => {
    const updatedAreas = new Set(selectedAreas);
    if (updatedAreas.has(areaTitle)) {
      updatedAreas.delete(areaTitle);
    } else {
      updatedAreas.add(areaTitle);
    }
    setSelectedAreas(updatedAreas);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <header style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
        <img src={logo2} alt="dino" style={{ height: '100px', marginRight: '10px' }} />
        <h1 style={{ margin: 0 }}>ROARS 🦖🦖🦖🦖🦖 Deadlines </h1>
      </header>
      <div className="App">
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>Loading...</h2>
          </div>
        ) : (
          <>
            <div className="sidebar">
              <h2>Filters</h2>
              <TextField
                label="Search by conference name"
                variant="outlined"
                name="search"
                value={searchQuery}
                onChange={handleSearchChange}
                style={{ marginBottom: '20px', width: '100%', fontSize: '1.0rem' }}
                fullWidth
              />
              <ul>
                {areas.map((area_title) => (
                  <li key={area_title}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedAreas.has(area_title)}
                          onChange={() => handleCheckboxChange(area_title)}
                          color="primary"
                        />
                      }
                      label={area_title}
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div className="conference-list">
              {filteredConferences.map(conf => (
                <ConferenceCard key={`${conf.name}-${conf.year}`} conference={conf} /> // Unique key
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;