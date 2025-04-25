import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea
} from 'recharts';

import sentimentData from '../data/sentiment_data.json';
import phases from '../data/phases.json';

// Vibrant phase colors
const phaseColors = [
  '#6baed6', 
  '#fd8d3c', 
  '#74c476', 
  '#e37777', 
  '#9e9ac8', 
  '#8c6d31', 
  '#c994c7', 
  '#969696', 
  '#bcbd22', 
  '#17becf', 
  '#9ecae1',  
  '#fdd0a2'  
];


const HeroJourneyChart = () => {
  const [hoverText, setHoverText] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Find max line from sentimentData
  const maxLine = Math.max(...sentimentData.map(d => d.line));

  const handleMouseLeave = () => {
    setHoverText(null);
  };

  return (
    <div style={{ position: 'relative', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>
        Sentiment Analysis of Nausicaä with Hero's Journey Phases
      </h2>

      <LineChart
        width={1200}
        height={600}
        data={sentimentData}
        margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
        onMouseMove={(e) => {
          if (e && e.activeLabel !== undefined) {
            const activeLine = e.activeLabel;
            const activePhase = phases.find(
              (phase) => activeLine >= phase.start && activeLine <= phase.end
            );
            if (activePhase) {
              setHoverText(activePhase.name);
              setPosition({ x: e.chartX, y: e.chartY });
            } else {
              setHoverText(null);
            }
          }
        }}
        onMouseLeave={handleMouseLeave}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="line"
          type='number'
          domain={[0, 684]} // Force domain to cover all Hero's Journey phases
          label={{ value: 'Script Line Number', position: 'insideBottomRight', offset: -5 }}
        />
        <YAxis
          domain={['auto', 'auto']}
          label={{ value: 'Sentiment Polarity', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip
          formatter={(value) => value.toFixed(2)}
          labelFormatter={(label) => `Line ${label}`}
        />

        {/* Phases with clamped rendering */}
        {phases.map((phase, idx) => (
          phase.start <= maxLine && (
            <ReferenceArea
              key={idx}
              x1={phase.start}
              x2={Math.min(phase.end, maxLine)} // Clamp x2 to maxLine
              fill={phaseColors[idx % phaseColors.length]}
              fillOpacity={0.6}
              ifOverflow="extendDomain"
            />
          )
        ))}

        <ReferenceArea y1={0} y2={0} stroke="red" strokeDasharray="5 5" label="Neutral" />

        <Line
          type="monotone"
          dataKey="sentiment"
          stroke="#007BFF"
          dot={false}
          name="NAUSICAA"
        />
      </LineChart>

      {/* Legend */}
      <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {phases.map((phase, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', margin: '5px 10px' }}>
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: phaseColors[idx % phaseColors.length],
              marginRight: '8px',
              border: '1px solid #ccc'
            }}></div>
            <span>{phase.name}</span>
          </div>
        ))}
      </div>

      {/* Hover Pop-up */}
      {hoverText && (
        <div style={{
          position: 'absolute',
          top: position.y + 40,
          left: position.x + 60,
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          maxWidth: '250px',
          pointerEvents: 'none',
          zIndex: 10
        }}>
          <strong>{hoverText}</strong>
        </div>
      )}
    </div>
  );
};

export default HeroJourneyChart;
