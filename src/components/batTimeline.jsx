import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Papa from "papaparse";
import { useState, useEffect } from 'react';
import { colorPalette } from '../assets/chartColorPalette';


const getBatId = (recording) => recording["MANUAL ID"] || recording["AUTO ID"] || recording["ALTERNATE 1"] || recording["ALTERNATE 2"] || "Unidentified";
const getRandomColor = () => "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0");

export default function BatTimeline({chartTitle}){

  const [timeUnit, setTimeUnit] = useState("hour")
  // change this to use day vs hour vs minute
  const getTimePoint = (recording) => {
    // return `${recording.DATE}-${recording.HOUR}-${recording.TIME?.split(":")[1]}`
    if (timeUnit==="hour"){
      return `${recording.DATE}-${recording.HOUR}`
    }else if (timeUnit==="day"){
      return `${recording.DATE}`
    }else{
      return `${recording.DATE}-${recording.HOUR}-${parseInt(recording.TIME?.split(":")[1])>30?"30":"00"}`
    }
  };
  const [batRawData, setBatRawData] = useState([]);
  const [batChartData, setBatChartData] = useState([]);
  const [batLines, setDistinctBatLines] = useState([])
  const changeHandler = (event) => {
    if (event.target.files[0]){
    Papa.parse(event.target.files[0], {
      header: true, 
      skipEmptyLines: true,
      complete: function (results) {
        console.log(results.data)
        
        setBatRawData(results.data)
        // Get distinct dates
        const datesWithHours = batRawData.map(recording => getTimePoint(recording));
        const distinctDatesWithHours = [...new Set(datesWithHours)];
        console.log(distinctDatesWithHours);

        // Get distinct bats
        const batIds = batRawData.map(recording => getBatId(recording));
        const distinctBatIds = [...new Set(batIds)];
        console.log(distinctBatIds);

        // Create a hash map of date:object, where the object has each kind of bat
        const dataPoints = {};
        distinctDatesWithHours.forEach(timePoint => {
          const dataPoint = {timePoint: timePoint};
          distinctBatIds.forEach(batId => dataPoint[batId] = 0);
          dataPoints[timePoint] = dataPoint;
        })
        console.log(dataPoints);

        // Update each object with how many of each bat we heard that day
        results.data.forEach(recording => {
          const batId = getBatId(recording);
          dataPoints[getTimePoint(recording)][batId]++;
        })

        // Convert the hashmap into a list
        const finalDataPointsList = Object.keys(dataPoints).map(timePoint => {
          const final = {...dataPoints[timePoint]};
          return final;
        })
        console.log(finalDataPointsList);

        setDistinctBatLines(distinctBatIds);
        setBatChartData(finalDataPointsList);
      },
    });}
  };
  useEffect(()=>{

  }, [timeUnit])

  // render() {
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
            <XAxis dataKey="diameter" />
            <YAxis />
            <Tooltip />
            <Legend />
            { batLines.map((batId, i) => <Line key={batId+i} type="monotone" dataKey={batId} stroke={i>=colorPalette.length?getRandomColor():colorPalette[i]}/>)}
          </LineChart>
        </ResponsiveContainer>}
      </section>
      <section id="radio">
        <label> By Hour
        <input type="radio" value="hour" name="timeUnit" checked={timeUnit==="hour"} onClick={()=>setTimeUnit("hour")}/>
        </label>
        <label> By Half Hour
        <input type="radio" value="halfHour" name="timeUnit" checked={timeUnit==="halfHour"} onClick={()=>setTimeUnit("halfHour")}/>
        </label>    
        <label> By Day
        <input type="radio" value="day" name="timeUnit" checked={timeUnit==="day"} onClick={()=>setTimeUnit("day")}/>
        </label>
      </section>        
      <input
      id='fileInput'
      type="file"
      name="file"
      accept=".csv"
      onChange={changeHandler}
      style={{ display: "block", margin: "10px auto" }}
      />

      </>
    );
  // }
}
