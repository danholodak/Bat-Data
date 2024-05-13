import "./App.css";
import BatTimeline from "./components/BatTimeline";
import TreeWidths from "./components/TreeWidths";
import BatsVTreeWidths from "./components/BatsVTreeWidths";
import BatsVTreeSpecies from "./components/BatsVTreeSpecies";
import { useState } from "react";
import TabBar from "./components/TabBar";

function App() {
  const [tab, setTab] = useState("bot");
  const [chartTitle, setChartTitle] = useState("");
  return (
    <div className="App">
      <TabBar tab={tab} setTab={setTab}></TabBar>
      <label>
        {" "}
        Set a title for your chart:
        <input
          id="titleInput"
          type="text"
          onChange={(e) => setChartTitle(e.target.value)}
        />
      </label>
      <main>
        {tab === "bot" && (
          <BatTimeline
            setChartTitle={setChartTitle}
            chartTitle={chartTitle}
          ></BatTimeline>
        )}
        {tab === "tw" && (
          <TreeWidths
            setChartTitle={setChartTitle}
            chartTitle={chartTitle}
          ></TreeWidths>
        )}
        {tab === "bvtw" && (
          <BatsVTreeWidths
            setChartTitle={setChartTitle}
            chartTitle={chartTitle}
          ></BatsVTreeWidths>
        )}
        {tab === "bvts" && (
          <BatsVTreeSpecies
            setChartTitle={setChartTitle}
            chartTitle={chartTitle}
          ></BatsVTreeSpecies>
        )}
      </main>
    </div>
  );
}

export default App;
