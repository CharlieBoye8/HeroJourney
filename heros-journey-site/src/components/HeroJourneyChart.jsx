import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea
} from 'recharts';

import sentimentData from '../data/sentiment_data.json';
import phases from '../data/phases.json';

const phaseColors = [
  '#d0e6f9', '#e0eaf3', '#fdf1dc', '#ece6e6', '#f8e6f2',
  '#d6f3f3', '#ffe0cc', '#e6f0e9', '#f9e0f0', '#f0e6d6',
  '#ccf2ff', '#e6ffe6'
];

const HeroJourneyChart = () => {
  const [hoverText, setHoverText] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

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
        <XAxis dataKey="line" label={{ value: 'Script Line Number', position: 'insideBottomRight', offset: -5 }} />
        <YAxis domain={['auto', 'auto']} label={{ value: 'Sentiment Polarity', angle: -90, position: 'insideLeft' }} />
        <Tooltip formatter={(value) => value.toFixed(2)} labelFormatter={(label) => `Line ${label}`} />

        {phases.map((phase, idx) => (
          <ReferenceArea
            key={idx}
            x1={phase.start}
            x2={phase.end}
            fill={phaseColors[idx % phaseColors.length]}
            fillOpacity={0.4}
            ifOverflow="extendDomain"
          />
        ))}

        <ReferenceArea y1={0} y2={0} stroke="red" strokeDasharray="5 5" label="Neutral" />

        <Line type="monotone" dataKey="sentiment" stroke="#007BFF" dot={false} name="NAUSICAA" />
      </LineChart>

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
