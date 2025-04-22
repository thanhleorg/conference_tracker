// components/fetchConferences.js
import yaml from 'js-yaml';
import Papa from 'papaparse';

async function parseCSV(url) {
  const response = await fetch(url);
  const text = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      complete: (results) => {
        const areasMap = {};
        const conferencesMap = {};

        results.data.forEach(row => {
          const areaTitle = row.AreaTitle;
          const parentArea = row.ParentArea;

          if (!areasMap[parentArea]) {
            areasMap[parentArea] = [];
          }
          if (!areasMap[parentArea].some(area => area.area_title === areaTitle)) {
            areasMap[parentArea].push({
              area: row.Area,
              area_title: areaTitle,
            });
          }

          if (!conferencesMap[areaTitle]) {
            conferencesMap[areaTitle] = new Set();
          }
          conferencesMap[areaTitle].add(row.ConferenceTitle);
        });

        const finalConferencesByArea = {};
        Object.keys(conferencesMap).forEach(areaTitle => {
          finalConferencesByArea[areaTitle] = Array.from(conferencesMap[areaTitle]);
        });

        resolve({
          areasMap,
          conferencesByArea: finalConferencesByArea,
          allConferenceNames: Object.values(conferencesMap).flatMap(set => Array.from(set)),
        });
      },
      error: (err) => reject(err)
    });
  });
}

export async function fetchFullData() {
  try {
    const yamlResponse = await fetch('/csconfs/data/conferences.yaml');
    const yamlText = await yamlResponse.text();
    const loadedConferences = yaml.load(yamlText) || [];

    const csrankingsData = await parseCSV('/csconfs/data/csrankings_conferences.csv');
    const coreData = await parseCSV('/csconfs/data/core_conferences.csv');

    return {
      loadedConferences,
      csrankingsData,
      coreData,
    };
  } catch (err) {
    console.error('Error loading conferences:', err);
    throw err;
  }
}