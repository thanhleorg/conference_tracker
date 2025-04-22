import React from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import logo from '../assets/t-rex-2.gif';

export default function Header() {
  return (
    <header style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
      <img src={logo} alt="dino" style={{ height: '100px', marginRight: '10px' }} />
      <div>
        <div>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              margin: 0,
              fontWeight: '900',
              letterSpacing: 2,
              background: 'rgb(117, 177, 109)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '1px 1px 4px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              userSelect: 'none',
              fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
              '@media (max-width:600px)': {
                fontSize: '1.8rem',
                letterSpacing: 1,
              },
            }}
          >
            CSConfs: CS Conference Deadlines 🚀🚀🚀
          </Typography>
        </div>
        <div>
          <Typography
            variant="body2"
            component="div"
            sx={{ marginTop: 1, color: 'text.secondary', userSelect: 'text' }}
          >
            <Link href="https://git.roars.dev/csconfs" target="_blank" rel="noopener" underline="hover">
              git.roars.dev/csconfs
            </Link>
          </Typography>
        </div>
      </div>
    </header>
  );
}