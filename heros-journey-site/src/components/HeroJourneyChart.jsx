import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
} from "recharts";

import sentimentData from "../data/sentiment_data.json";
import phases from "../data/phases.json";
import phaseNotes from "../data/phaseNotes.json";
import "../styles/HeroJourneyChart.css";

const phaseColors = [
  "#6baed6", "#fd8d3c", "#74c476", "#e37777",
  "#9e9ac8", "#8c6d31", "#c994c7", "#969696",
  "#bcbd22", "#17becf", "#9ecae1", "#fdd0a2"
];

const lineColors = ["#000000", "#d62728", "#2ca02c", "#ff7f0e"];
const characters = ["NAUSICAA", "KUSHANA", "YUPA", "MITO"];
const importantPoints = [3, 32, 120, 242, 278, 326, 592, 638];

const HeroJourneyChart = () => {
  const [hoverText, setHoverText] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedCharacters, setSelectedCharacters] = useState(["NAUSICAA"]);
  const [noteText, setNoteText] = useState(null);

  const maxLine = Math.max(...sentimentData.map((d) => d.line));

  const handleMouseLeave = () => {
    setHoverText(null);
  };

  const toggleCharacter = (char) => {
    setSelectedCharacters((prev) =>
      prev.includes(char) ? prev.filter((c) => c !== char) : [...prev, char]
    );
  };

  const getPointNotesInPhase = (phase) => {
    const pointsInPhase = importantPoints.filter(
      (pt) => pt >= phase.start && pt <= phase.end
    );
    return pointsInPhase.map(
      (pt) => `<strong>Line ${pt}:</strong> ${phaseNotes[pt.toString()]}`
    ).join("<br/><br/>");
  };

  return (
    <div className="chart-container">
      <h2 className="chart-title">
        Sentiment Analysis of Nausicaä with Hero's Journey Phases
      </h2>

      <div className="character-selector">
        {characters.map((char) => (
          <label key={char}>
            <input
              type="checkbox"
              checked={selectedCharacters.includes(char)}
              onChange={() => toggleCharacter(char)}
            />
            {char}
          </label>
        ))}
      </div>

      <div className="chart-wrapper">
        <LineChart
          width={800}
          height={500}
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
            type="number"
            domain={[0, 684]}
            label={{ value: "Script Line Number", position: "insideBottomRight", offset: -5 }}
          />
          <YAxis
            domain={["auto", "auto"]}
            label={{ value: "Sentiment Polarity", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            formatter={(value) => value.toFixed(2)}
            labelFormatter={(label) => `Line ${label}`}
          />

          {phases.map((phase, idx) =>
            phase.start <= maxLine && (
              <ReferenceArea
                key={idx}
                x1={phase.start}
                x2={Math.min(phase.end, maxLine)}
                fill={phaseColors[idx % phaseColors.length]}
                fillOpacity={0.6}
                ifOverflow="extendDomain"
                onClick={() => {
                  const phaseNote = `<strong>${phase.name}:</strong> ${phaseNotes[phase.name] || "No note."}`;
                  const pointNotes = getPointNotesInPhase(phase);
                  const combinedNotes = pointNotes
                    ? `${phaseNote}<br/><br/>${pointNotes}`
                    : phaseNote;
                  setNoteText(combinedNotes);
                }}
              />
            )
          )}

          {selectedCharacters.map((char, idx) => (
            <Line
              key={char}
              type="monotone"
              dataKey={char.toLowerCase()}
              stroke={lineColors[idx % lineColors.length]}
              dot={({ cx, cy, payload }) => {
                if (importantPoints.includes(payload.line)) {
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill="black"
                      stroke="white"
                      strokeWidth={1}
                      onClick={() =>
                        setNoteText(
                          `<strong>Line ${payload.line}:</strong> ${phaseNotes[payload.line.toString()] || "No note."}`
                        )
                      }
                      style={{ cursor: "pointer" }}
                    />
                  );
                }
                return null;
              }}
              name={char}
            />
          ))}
        </LineChart>

        {!noteText ? (
          <div className="legend-container">
            {phases.map((phase, idx) => (
              <div key={idx} className="legend-item">
                <div className="legend-color" style={{ backgroundColor: phaseColors[idx % phaseColors.length] }}></div>
                <span>{phase.name}</span>
              </div>
            ))}
            <div className="legend-item">
              <div className="legend-line"></div>
              <span>Neutral Line</span>
            </div>
            {selectedCharacters.map((char, idx) => (
              <div key={char} className="legend-item">
                <div className="legend-line-color" style={{ borderTopColor: lineColors[idx % lineColors.length] }}></div>
                <span>{char}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="note-box">
            <button className="close-btn" onClick={() => setNoteText(null)}>X</button>
            <div dangerouslySetInnerHTML={{ __html: noteText }} />
          </div>
        )}
      </div>

      {hoverText && (
        <div
          className="hover-tooltip"
          style={{ top: position.y + 40, left: position.x + 60 }}
        >
          <strong>{hoverText}</strong>
        </div>
      )}
    </div>
  );
};

export default HeroJourneyChart;
