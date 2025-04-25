import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        marginTop: 4,
        padding: 2,
        textAlign: 'center',
        borderTop: '1px solid #ddd',
        color: 'text.secondary',
        // '@media (max-width:600px)': {
        //   fontSize: '0.2rem',
        // },
      }}
    >
      <Typography variant="body2">
      ROARS © {new Date().getFullYear()}. This footer is written by human.
      </Typography>
    </Box>
  );
}