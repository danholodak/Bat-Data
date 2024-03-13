import logo from './logo.svg';
import './App.css';
import BatTimeline from './components/BatTimeline';
import TreeWidths from './components/TreeWidths';
import { useState } from 'react';
import TabBar from './components/TabBar';

function App() {
  const [tab, setTab] = useState("bot")
  return (
    <div className="App">
      <TabBar tab={tab} setTab={setTab}></TabBar>
      <main>
      {tab=="bot"&&<BatTimeline></BatTimeline>}
      {tab=="tw"&&<TreeWidths></TreeWidths>}
      </main>
    </div>
  );
}

export default App;
