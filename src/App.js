import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';

import { FetchConferencesData } from './components/FetchConferences';
import ConferenceCard from './components/ConferenceCard';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import './App.css';


function App() {
  const [conferences, setConferences] = useState([]);
  const [filteredConferences, setFilteredConferences] = useState([]);
  const [areas, setAreas] = useState({});
  const [selectedConferences, setSelectedConferences] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [conferencesByArea, setConferencesByArea] = useState({});
  
  const [openParents, setOpenParents] = useState({});
  const [openAreas, setOpenAreas] = useState({});
  
  const toggleParent = (parentArea) => {
    setOpenParents(prev => ({ ...prev, [parentArea]: !prev[parentArea] }));
  };
  
  const toggleArea = (areaTitle) => {
    setOpenAreas(prev => ({ ...prev, [areaTitle]: !prev[areaTitle] }));
  };

  // Given ParentArea name, get all conferences under it
  const getConferencesByParentArea = (parentArea) => {
    let confs = [];
    const areaDetails = areas[parentArea] || [];
    areaDetails.forEach(({ area_title }) => {
      confs = confs.concat(conferencesByArea[area_title] || []);
    });
    return confs;
  };

  // Given Area title, get all conferences under it
  const getConferencesByAreaTitle = (areaTitle) => {
    return conferencesByArea[areaTitle] || [];
  };

  // Check if all conferences in list are selected
  const isAllSelected = (confList) => {
    return confList.length > 0 && confList.every(c => selectedConferences.has(c));
  };

  // Check if some (but not all) selected for indeterminate state
  const isSomeSelected = (confList) => {
    return confList.some(c => selectedConferences.has(c)) && !isAllSelected(confList);
  };

  // Toggle multiple conferences at once: select or deselect all in confList
  const toggleMultipleConferences = (confList, select) => {
    const updatedSelected = new Set(selectedConferences);
    confList.forEach(confName => {
      if (select) updatedSelected.add(confName);
      else updatedSelected.delete(confName);
    });
    setSelectedConferences(updatedSelected);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { loadedConferences, areasMap, finalConferencesByArea, allConfNamesFromCSV } = await FetchConferencesData();
  
        setAreas(areasMap);
        setConferencesByArea(finalConferencesByArea);
        setConferences(loadedConferences);
        setFilteredConferences(loadedConferences);
        setSelectedConferences(new Set(allConfNamesFromCSV)); // Select all CSV conferences initially
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  
  const filterConferences = () => {
    const selected = Array.from(selectedConferences);
    const updatedConferences = conferences.filter(conf => {
      const matchesConference = selected.includes(conf.name);
      const matchesSearch = conf.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesConference && matchesSearch;
    });

    const sortedConferences = updatedConferences.sort((a, b) => {
      const deadlineA = new Date(a.deadline);
      const deadlineB = new Date(b.deadline);
      const now = new Date();
      if (deadlineA > now && deadlineB > now) {
        return deadlineA - deadlineB;
      } else if (deadlineA <= now && deadlineB <= now) {
        return 0;
      } else if (deadlineA > now) {
        return -1;
      } else {
        return 1;
      }
    });

    setFilteredConferences(sortedConferences);
  };

  useEffect(() => {
    filterConferences();
    // eslint-disable-next-line
  }, [selectedConferences, searchQuery, conferences]);

  const handleCheckboxChange = (conferenceName) => {
    const updatedSelected = new Set(selectedConferences);
    if (updatedSelected.has(conferenceName)) {
      updatedSelected.delete(conferenceName);
    } else {
      updatedSelected.add(conferenceName);
    }
    setSelectedConferences(updatedSelected);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <Header />
      <div className="App">
        {loading ? ( 
          <div style={{ textAlign: 'center', marginTop: '20px' }}> <h2>Loading...</h2> </div>
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
              <Sidebar
                areas={areas}
                conferencesByArea={conferencesByArea}
                selectedConferences={selectedConferences}
                openParents={openParents}
                openAreas={openAreas}
                toggleParent={toggleParent}
                toggleArea={toggleArea}
                handleCheckboxChange={handleCheckboxChange}
                isAllSelected={isAllSelected}
                isSomeSelected={isSomeSelected}
                toggleMultipleConferences={toggleMultipleConferences}
                getConferencesByParentArea={getConferencesByParentArea}
                getConferencesByAreaTitle={getConferencesByAreaTitle}
              />
            </div>
            <div className="conference-list">
              {filteredConferences.map(conf => (
                <ConferenceCard key={`${conf.name}-${conf.year}`} conference={conf} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;