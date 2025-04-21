import Papa from 'papaparse';
import yaml from 'js-yaml';

export async function FetchConferencesData() {
  try {
    // Fetch and parse YAML data
    const yamlResponse = await fetch('/csconfs/data/conferences.yaml');
    const yamlText = await yamlResponse.text();
    const loadedConferences = yaml.load(yamlText) || [];

    // Fetch and parse CSV data
    const csvResponse = await fetch('/csconfs/data/conferences.csv');
    const csvText = await csvResponse.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          const areasMap = {};
          const conferencesMap = {};

          results.data.forEach(row => {
            const areaTitle = row.AreaTitle;
            const parentArea = row.ParentArea || "Other";

            if (!areasMap[parentArea]) {
              areasMap[parentArea] = [];
            }
            if (!areasMap[parentArea].some(area => area.area_title === areaTitle)) {
              areasMap[parentArea].push({
                area: row.Area,
                area_title: areaTitle
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

          // Gather all CSV conference names for initial selection
          const allConfNamesFromCSV = [];
          Object.values(conferencesMap).forEach(setOfConfs => {
            allConfNamesFromCSV.push(...Array.from(setOfConfs));
          });

          resolve({
            loadedConferences,
            areasMap,
            finalConferencesByArea,
            allConfNamesFromCSV,
          });
        },
        error: (error) => {
          reject(error);
        }
      });
    });

  } catch (error) {
    console.error("Error loading conferences:", error);
    throw error;
  }
}