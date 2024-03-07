import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Papa from "papaparse";
import { useState } from 'react';

const getBatId = (recording) => recording["MANUAL ID"] || recording["AUTO ID"] || recording["ALTERNATE 1"] || recording["ALTERNATE 2"] || "Unidentified";
const getRandomColor = () => "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0");

export default function Example(){
  // static demoUrl = 'https://codesandbox.io/s/simple-line-chart-kec3v';
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
        // for each day present in raw data, make a data point
        // get all bat kinds we know about, and for each day, set to zero
        // then for each bat point we see, increment the data for that bat kind on that day
        // batRawData[i].DATE, batRawData[i]["AUTO ID"], batRawData[i]["ALTERNATE 1"], batRawData[i]["ALTERNATE 2"], batRawData[i]["MANUAL ID"]
        const dates = results.data.map(recording => recording.DATE);
        const distinctDates = [...new Set(dates)];
        console.log(distinctDates);
        const batIds = results.data.map(recording => getBatId(recording));
        const distinctBatIds = [...new Set(batIds)];
        console.log(distinctBatIds);
      /*  const dataPoints = distinctDates.map(date => {
          const dataPoint = {DATE: date};
          distinctBatIds.forEach(batId => dataPoint[batId] = 0);
          return dataPoint;
        });
*/
        const dataPoints = {};
        distinctDates.forEach(date => {
          const dataPoint = {DATE: date};
          distinctBatIds.forEach(batId => dataPoint[batId] = 0);
          dataPoints[date] = dataPoint;
        })
        console.log(dataPoints);

        results.data.forEach(recording => {
          const batId = getBatId(recording);
          dataPoints[recording.DATE][batId]++;
        })

        const finalDataPointsList = Object.keys(dataPoints).map(date => {
          const final = {...dataPoints[date]};
          return final;
        })
        console.log(finalDataPointsList);

        setDistinctBatLines(distinctBatIds);
        setBatChartData(finalDataPointsList);
      },
    });
  };

  // TODO: why doesn't this work :')
  const chartLines = batLines.map(batId => {
    <Line type="monotone" dataKey={batId} stroke={getRandomColor()} activeDot={{ r: 8 }} />
  });
  
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
          <XAxis dataKey="DATE" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Unidentified" stroke={getRandomColor()}  />
          <Line type="monotone" dataKey="LABSOR" stroke={getRandomColor()} />
          <Line type="monotone" dataKey="NoID" stroke={getRandomColor()} />
          <Line type="monotone" dataKey="Potential PERSUB" stroke={getRandomColor()} />
          <Line type="monotone" dataKey="MYOLUC" stroke={getRandomColor()}  />
          <Line type="monotone" dataKey="MULTIPLE W PULSES" stroke={getRandomColor()} />
          <Line type="monotone" dataKey="PERSUB" stroke={getRandomColor()}/>
          <Line type="monotone" dataKey="POTLASBOR" stroke={getRandomColor()} />
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
