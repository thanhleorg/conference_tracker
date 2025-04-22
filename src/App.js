import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import ConferenceDisplay from './components/ConferenceDisplay';
import { fetchFullData } from './components/FetchConferences';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import './App.css';

function App() {
  const [conferences, setConferences] = useState([]);
  const [filteredConferences, setFilteredConferences] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // States for both datasets
  const [csrAreas, setCsrAreas] = useState({});
  const [csrConfsByArea, setCsrConfsByArea] = useState({});
  const [coreAreas, setCoreAreas] = useState({});
  const [coreConfsByArea, setCoreConfsByArea] = useState({});

  const [selectedConferences, setSelectedConferences] = useState(new Set());
  const [openTopLevel, setOpenTopLevel] = useState({ csrankings: true, core: true });
  // Store openParents and openAreas as objects with keys prefixed by datasetId, e.g. 'csrankings:KDD'
  const [openParents, setOpenParents] = useState({});
  const [openAreas, setOpenAreas] = useState({});

  const [hidePastDeadlines, setHidePastDeadlines] = useState(true);

  // Toggle parent accepts datasetId to uniquely key openParents state
  const toggleParent = (datasetId, parentArea) => {
    const key = `${datasetId}:${parentArea}`;
    setOpenParents(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Toggle area accepts datasetId to uniquely key openAreas state
  const toggleArea = (datasetId, areaTitle) => {
    const key = `${datasetId}:${areaTitle}`;
    setOpenAreas(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getConferencesByParentArea = (datasetId, parentArea) => {
    const areasObj = datasetId === 'csrankings' ? csrAreas : coreAreas;
    const confsByArea = datasetId === 'csrankings' ? csrConfsByArea : coreConfsByArea;
    let confs = [];
    const areaDetails = areasObj[parentArea] || [];
    areaDetails.forEach(({ area_title }) => {
      confs = confs.concat(confsByArea[area_title] || []);
    });
    return confs;
  };

  const getConferencesByAreaTitle = (datasetId, areaTitle) => {
    return (datasetId === 'csrankings' ? csrConfsByArea : coreConfsByArea)[areaTitle] || [];
  };

  // Check selected state helpers
  const isAllSelected = confList => confList.length > 0 && confList.every(c => selectedConferences.has(c));
  const isSomeSelected = confList => confList.some(c => selectedConferences.has(c)) && !isAllSelected(confList);

  const toggleMultipleConferences = (confList, select) => {
    const updatedSelected = new Set(selectedConferences);
    confList.forEach(confName => {
      if (select) updatedSelected.add(confName);
      else updatedSelected.delete(confName);
    });
    setSelectedConferences(updatedSelected);
  };

  useEffect(() => {
    const loadData = async () => {
      const { loadedConferences, csrankingsData, coreData } = await fetchFullData();

      setCsrAreas(csrankingsData.areasMap);
      setCsrConfsByArea(csrankingsData.conferencesByArea);
      setCoreAreas(coreData.areasMap);
      setCoreConfsByArea(coreData.conferencesByArea);

      // Select all conferences from both datasets initially
      const allConfs = [
        ...csrankingsData.allConferenceNames,
        // ...coreData.allConferenceNames,
      ];
      
      const initiallyCheckedConfs = allConfs.filter(
        confName => csrankingsData.nextTierFlags[confName] === false
      );

      setSelectedConferences(new Set(initiallyCheckedConfs));

      // Also set loaded YAML conferences for filtering
      setConferences(loadedConferences);

      setLoading(false);
    };
    loadData();
  }, []);

  const filterConferences = () => {
    const selected = Array.from(selectedConferences);
    const now = new Date();
  
    const updatedConferences = conferences.filter(conf => {
      const matchesConference = selected.includes(conf.name);
      const matchesSearch = conf.name.toLowerCase().includes(searchQuery.toLowerCase());
  
      const deadlineDate = new Date(conf.deadline);
      // Filter out past deadline conferences if hidePastDeadlines is true
      const isUpcoming = !hidePastDeadlines || deadlineDate >= now;
  
      return matchesConference && matchesSearch && isUpcoming;
    });
  
    // (Sort as before)
    const sortedConferences = updatedConferences.sort((a, b) => {
      const deadlineA = new Date(a.deadline);
      const deadlineB = new Date(b.deadline);
      if (deadlineA > now && deadlineB > now) return deadlineA - deadlineB;
      else if (deadlineA <= now && deadlineB <= now) return 0;
      else if (deadlineA > now) return -1;
      else return 1;
    });
  
    setFilteredConferences(sortedConferences);
  };

  useEffect(() => {
    filterConferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConferences, searchQuery, conferences, hidePastDeadlines]);

  const handleCheckboxChange = conferenceName => {
    const updatedSelected = new Set(selectedConferences);
    if (updatedSelected.has(conferenceName)) {
      updatedSelected.delete(conferenceName);
    } else {
      updatedSelected.add(conferenceName);
    }
    setSelectedConferences(updatedSelected);
  };

  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <Header />
      <div className="App">
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>Loading...</h2>
          </div>
        ) : (
          <>
            <div className="sidebar">
              <h2>Filters</h2>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={hidePastDeadlines}
                    onChange={e => setHidePastDeadlines(e.target.checked)}
                    color="primary"
                  />
                }
                label="Hide past deadline conferences"
              />
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
                datasets={{
                  csrankings: { areas: csrAreas, conferencesByArea: csrConfsByArea },
                  core: { areas: coreAreas, conferencesByArea: coreConfsByArea },
                }}
                selectedConferences={selectedConferences}
                openTopLevel={openTopLevel}
                setOpenTopLevel={setOpenTopLevel}
                openParents={openParents}
                setOpenParents={setOpenParents}
                openAreas={openAreas}
                setOpenAreas={setOpenAreas}
                toggleMultipleConferences={toggleMultipleConferences}
                handleCheckboxChange={handleCheckboxChange}
                getConferencesByParentArea={getConferencesByParentArea}
                getConferencesByAreaTitle={getConferencesByAreaTitle}
                isAllSelected={isAllSelected}
                isSomeSelected={isSomeSelected}
                toggleParent={toggleParent}
                toggleArea={toggleArea}
              />
            </div>
           

            <ConferenceDisplay filteredConferences={filteredConferences} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;