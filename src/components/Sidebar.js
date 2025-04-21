import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Define your parent area colors palette here or import from a shared file
const parentAreaColors = [
  '#1f77b4',  '#ff7f0e',  '#2ca02c',  '#d62728',  '#9467bd',
  '#8c564b',  '#e377c2',  '#7f7f7f',  '#bcbd22',  '#17becf',
];

export default function Sidebar(props) {
  // Destructure all required props
  const {
    areas,
    conferencesByArea,
    selectedConferences,
    openParents,
    openAreas,
    toggleParent,
    toggleArea,
    handleCheckboxChange,
    isAllSelected,
    isSomeSelected,
    toggleMultipleConferences,
    getConferencesByParentArea,
    getConferencesByAreaTitle,
  } = props;

  return (
    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
      {Object.entries(areas).map(([parentArea, areaDetails], parentIndex) => {
        const parentConfs = getConferencesByParentArea(parentArea);
        const parentColor = parentAreaColors[parentIndex % parentAreaColors.length];

        return (
          <li key={parentArea} style={{ marginBottom: '8px', color: parentColor }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox
                indeterminate={isSomeSelected(parentConfs)}
                checked={isAllSelected(parentConfs)}
                onChange={(e) => toggleMultipleConferences(parentConfs, e.target.checked)}
                color="primary"
                size="small"
                style={{ padding: 0, marginRight: 4 }}
              />
              <div
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexGrow: 1 }}
                onClick={() => toggleParent(parentArea)}
              >
                <IconButton size="small" sx={{ color: parentColor }}>
                  {openParents[parentArea] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
                <strong>{parentArea}</strong>
              </div>
            </div>
            <Collapse in={openParents[parentArea]} timeout="auto" unmountOnExit>
              <ul style={{ listStyle: 'none', paddingLeft: '24px' }}>
                {areaDetails.map(({ area_title }) => {
                  const areaConfs = getConferencesByAreaTitle(area_title);

                  return (
                    <li key={area_title} style={{ marginBottom: '4px', color: parentColor }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Checkbox
                          indeterminate={isSomeSelected(areaConfs)}
                          checked={isAllSelected(areaConfs)}
                          onChange={(e) => toggleMultipleConferences(areaConfs, e.target.checked)}
                          color="primary"
                          size="small"
                          style={{ padding: 0, marginRight: 4 }}
                        />
                        <div
                          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexGrow: 1 }}
                          onClick={() => toggleArea(area_title)}
                        >
                          <IconButton size="small" sx={{ color: parentColor }}>
                            {openAreas[area_title] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                          <strong>{area_title}</strong>
                        </div>
                      </div>
                      <Collapse in={openAreas[area_title]} timeout="auto" unmountOnExit>
                        <ul style={{ listStyle: 'none', paddingLeft: '24px' }}>
                          {conferencesByArea[area_title]?.map(conferenceName => (
                            <li key={conferenceName} style={{ color: parentColor }}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={selectedConferences.has(conferenceName)}
                                    onChange={() => handleCheckboxChange(conferenceName)}
                                    color="primary"
                                    size="small"
                                  />
                                }
                                label={conferenceName}
                              />
                            </li>
                          ))}
                        </ul>
                      </Collapse>
                    </li>
                  );
                })}
              </ul>
            </Collapse>
          </li>
        );
      })}
    </ul>
  );
}