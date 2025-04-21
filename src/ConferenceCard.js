import React, { useEffect, useState } from 'react';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';

const StyledLink = styled(Link)({
  color: 'inherit',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
    color: 'blue', // Change to your desired hover color
  },
});

const calculateCountdown = (deadline) => {
  if (!deadline) return 'No deadline';
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const difference = deadlineDate - now;
  if (difference <= 0) return 'Deadline passed';
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);
  if ([days, hours, minutes, seconds].some(isNaN)) {
    return 'No deadline';
  }
  return `${days}d, ${hours}h, ${minutes}m, ${seconds}s`;
};

const ConferenceCard = ({ conference }) => {
  const [countdown, setCountdown] = useState(calculateCountdown(conference.deadline));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculateCountdown(conference.deadline));
    }, 1000);
    return () => clearInterval(interval);
  }, [conference.deadline]);  // Ensure that the interval runs for this specific conference

  return (
    <Card variant="outlined" style={{ marginLeft: '20px', marginBottom: '5px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', marginBottom: '5px' }}>
              <Typography variant="h5" component="div" style={{ color: 'black', fontWeight: 'bold', fontSize: '2.0rem' }}>
                <StyledLink href={conference.link} target="_blank" rel="noopener noreferrer">
                  {conference.name} {conference.year}
                </StyledLink>
              </Typography>
              <Typography variant="body2" color="textSecondary" style={{ fontSize: '1.0rem' }}>
                {conference.area_title}
              </Typography>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '50px', marginBottom: '5px' }}>
              <Typography variant="body2" color="black" style={{ fontSize: '1.0rem' }}>
                Deadline: {new Date(conference.deadline).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
              </Typography>
              <Typography variant="body2" color="black" style={{ fontSize: '1.0rem' }}>
                Location: {conference.place}
              </Typography>
              <Typography variant="body2" color="black" style={{ fontSize: '1.0rem' }}>
                Date: {conference.date}
              </Typography>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Typography variant="h6" style={{ color: 'red', fontWeight: 'bold', fontSize: '2.5rem' }}>
              {countdown}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConferenceCard;