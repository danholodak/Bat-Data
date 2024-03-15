import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Papa from "papaparse";
import { useState } from 'react';
import { colorPalette } from '../assets/chartColorPalette';


const getBatId = (recording) => recording["MANUAL ID"] || recording["AUTO ID"] || recording["ALTERNATE 1"] || recording["ALTERNATE 2"] || "Unidentified";
const getRandomColor = () => "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0");
// change this to use day vs hour vs minute
const getTimePoint = recording => `${recording.DATE}-${recording.HOUR}-${recording.TIME?.split(":")[1]}`;

export default function BatTimeline(){

  const [batRawData, setBatRawData] = useState([]);
  const [batChartData, setBatChartData] = useState([]);
  const [batLines, setDistinctBatLines] = useState([])
  const changeHandler = (event) => {
    Papa.parse(event.target.files[0], {
      header: true, 
      skipEmptyLines: true,
      complete: function (results) {
        console.log(results.data)
        
        setBatRawData(results.data)
        // Get distinct dates
        const datesWithHours = results.data.map(recording => getTimePoint(recording));
        const distinctDatesWithHours = [...new Set(datesWithHours)];
        console.log(distinctDatesWithHours);

        // Get distinct bats
        const batIds = results.data.map(recording => getBatId(recording));
        const distinctBatIds = [...new Set(batIds)];
        console.log(distinctBatIds);
      /*  const dataPoints = distinctDates.map(date => {
          const dataPoint = {DATE: date};
          distinctBatIds.forEach(batId => dataPoint[batId] = 0);
          return dataPoint;
        });
*/
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
    });
  };

  // render() {
    return (
      <>
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
          { batLines.map(batId => <Line type="monotone" dataKey={batId} stroke={getRandomColor()}/>)}
        </LineChart>
      </ResponsiveContainer>}

      <input
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
