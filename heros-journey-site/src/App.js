import React from "react";
import HeroJourneyChart from "./components/HeroJourneyChart";
import "./App.css";

function App() {
  return (
    <div className="App" style={{ textAlign: "center", padding: "20px" }}>
      <h1>Nausicaä Hero's Journey Sentiment Analysis</h1>
      <HeroJourneyChart />
    </div>
  );
}

export default App;
