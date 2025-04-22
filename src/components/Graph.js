import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

// Parse date string to number of days since epoch (UTC midnight)
const parseDateToDays = (dateStr) => {
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  return Math.floor(d.getTime() / (1000 * 60 * 60 * 24));
};

// Custom tooltip showing conference info
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const conf = payload[0].payload;
  return (
    <div style={{ background: '#fff', border: '1px solid #ccc', padding: 10 }}>
      <strong>{conf.name}</strong>
      <div>Deadline: {new Date(conf.deadline).toLocaleDateString()}</div>
      <div>Notification: {new Date(conf.notification_date).toLocaleDateString()}</div>
      <div>
        Duration: {conf.length.toFixed(1)} day{conf.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default function Graph({ conferences }) {
  // Filter conferences having both required dates
  const events = conferences
    .filter(c => c.deadline && c.notification_date)
    .map((c, idx) => {
      const start = parseDateToDays(c.deadline);
      const end = parseDateToDays(c.notification_date);
      if (start === null || end === null || end < start) return null;
      return {
        name: c.name + (c.year ? ` ${c.year}` : ''),
        start,
        length: end - start,
        deadline: c.deadline,
        notification_date: c.notification_date,
        yIndex: idx,
      };
    })
    .filter(Boolean);

  if (!events.length) {
    return <p>No conferences with notification dates to display.</p>;
  }

  // Calculate earliest start date
  const minStart = Math.min(...events.map(e => e.start));
  const maxEnd = Math.max(...events.map(e => e.start + e.length));

  // Normalize starts relative to earliest date
  const data = events.map(e => ({
    ...e,
    normStart: e.start - minStart,
  }));

  // Define x-axis domain with little padding (5 days)
  const domainStart = 0;
  const domainEnd = maxEnd - minStart + 5;

  const colors = [
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff7f50',
    '#6a5acd',
    '#2196f3',
    '#ffb300',
    '#00bfa5',
    '#f06292',
    '#ffa726',
  ];

  return (
    <ResponsiveContainer width="100%" height={50 + data.length * 40}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 20, right: 0, left: 0, bottom: 20 }} 
        barCategoryGap={15}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          domain={[domainStart, domainEnd]}
          tickFormatter={tick => {
            const realDate = new Date((minStart + tick) * 24 * 60 * 60 * 1000);
            return realDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          }}
          // label={{ value: 'Date', position: 'insideBottom', offset: -10 }}
          tickCount={6}
          interval="preserveStartEnd"
        />
        <YAxis
          type="category"
          dataKey="name"
          width={180} // increased left width for long labels
          interval={0}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 16, fontWeight: 'bold', wordBreak: 'break-word' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="normStart"
          stackId="a"
          fill="transparent"
          isAnimationActive={false}
          legendType="none"
          barSize={25}
        />
        <Bar
          dataKey="length"
          stackId="a"
          isAnimationActive={false}
          minPointSize={5}
          barSize={25} // nicer thickness
          radius={[4, 4, 4, 4]} // rounded corners: top-left, top-right, bottom-right, bottom-left
          stroke="#555" // subtle border color
          strokeWidth={1}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}