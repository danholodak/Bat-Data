import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Papa from "papaparse";
import { useState, useEffect } from 'react';
import { colorPalette } from '../assets/chartColorPalette';

const getBatId = (recording) => recording["MANUAL ID"] || recording["AUTO ID"] || recording["ALTERNATE 1"] || recording["ALTERNATE 2"] || "Unidentified";
const getRandomColor = () => "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0");

export default function BatTimeline({chartTitle}) {
  const [timeUnit, setTimeUnit] = useState("hour");
  const [batRawData, setBatRawData] = useState();
  const [batChartData, setBatChartData] = useState([]);
  const [batLines, setDistinctBatLines] = useState([]);

  const getTimePoint = (recording) => {
    if (timeUnit === "day") {
      return `${recording.DATE}`;
    }

    if (timeUnit === "hour") {
      return `${recording.DATE} ${recording.HOUR}:00`;
    }

    if (timeUnit == "halfHour") {
      const minutes = parseInt(recording.TIME?.split(":")[1]);
      const minuteGroup = minutes > 30 ? "30" : "00";
      const time = `${recording.HOUR}:${minuteGroup}`;
      return `${recording.DATE} ${time}`;
    }

    // 10 minutes
    const minutes = parseInt(recording.TIME?.split(":")[1]);
    const time = `${recording.HOUR}:${Math.floor(minutes/10)}0`;
    return `${recording.DATE} ${time}`;
  };

  const onFileUpload = (event) => {
    console.log("onFileUpload", event);
    if (event.target.files[0]){
      setBatRawData(event.target.files[0]);
    }
  };

  const updateChart = () => {
    console.log("updateChart", batRawData);
    if (!batRawData) {
      return;
    }

    Papa.parse(batRawData, {
      header: true, 
      skipEmptyLines: true,
      complete: function (results) {
        console.log("data", results.data);
        // Get distinct timepoints
        const datesWithTime = results.data.map(recording => getTimePoint(recording));
        console.log("datesWithTime", datesWithTime);
        const distinctDatesWithTime = [...new Set(datesWithTime)];
        console.log("distinctDatesWithTime", distinctDatesWithTime);

        // Get distinct bats
        const batIds = results.data.map(recording => getBatId(recording));
        const distinctBatIds = [...new Set(batIds)];
        console.log("distinctBatIds", distinctBatIds);

        // Create a hash map of date:object, where the object has each kind of bat
        const dataPoints = {};
        distinctDatesWithTime.forEach(timePoint => {
          const dataPoint = {timePoint: timePoint};
          distinctBatIds.forEach(batId => dataPoint[batId] = 0);
          dataPoints[timePoint] = dataPoint;
        });
        console.log("dataPoints", dataPoints);

        // Update each object with how many of each bat we heard that day
        results.data.forEach(recording => {
          const batId = getBatId(recording);
          dataPoints[getTimePoint(recording)][batId]++;
        });

        // Convert the hashmap into a list
        const dataPointsList = Object.keys(dataPoints).map(timePoint => {
          const final = {...dataPoints[timePoint]};
          return final;
        });

        const sortedDataPointsList = dataPointsList.sort((a,b) => (a.timePoint > b.timePoint) ? 1 : ((b.timePoint > a.timePoint) ? -1 : 0));
        console.log("sortedDataPointsList", sortedDataPointsList);

        setDistinctBatLines(distinctBatIds);
        setBatChartData(sortedDataPointsList);
      },
    });
  };

  useEffect(
    () => { updateChart(); },
    [timeUnit, batRawData]
  );

  return (
    <>
      <section className='theChart'>
        <h1>{chartTitle}</h1>
        {batChartData && 
        <ResponsiveContainer width="100%" height="100%" minWidth="500px" minHeight="500px">
          <LineChart
            width={500}
            height={300}
            data={batChartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timePoint" />
            <YAxis />
            <Tooltip />
            <Legend />
            { batLines.map((batId, i) => <Line key={batId+i} type="monotone" dataKey={batId} stroke={i>=colorPalette.length?getRandomColor():colorPalette[i]}/>)}
          </LineChart>
        </ResponsiveContainer>}
      </section>
      <br/>
      <section id="radio">
        Bucketed by:&nbsp;
        <label>
          <input type="radio" value="halfHour" name="timeUnit" checked={timeUnit==="10Minutes"} onClick={()=>setTimeUnit("10Minutes")}/>
          10 minutes
        </label>    
        <label>
          <input type="radio" value="halfHour" name="timeUnit" checked={timeUnit==="halfHour"} onClick={()=>setTimeUnit("halfHour")}/>
          1/2 Hour
        </label>    
        <label>
          <input type="radio" value="hour" name="timeUnit" checked={timeUnit==="hour"} onClick={()=>setTimeUnit("hour")}/>
          Hour
        </label>
        <label>
          <input type="radio" value="day" name="timeUnit" checked={timeUnit==="day"} onClick={()=>setTimeUnit("day")}/>
            Day
        </label>
      </section>        
      <input
        id='fileInput'
        type="file"
        name="file"
        accept=".csv"
        onChange={onFileUpload}
        style={{ display: "block", margin: "10px auto" }}
      />
    </>
  );
}
