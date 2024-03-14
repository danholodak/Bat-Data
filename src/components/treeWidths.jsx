import React, { PureComponent } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import Papa from "papaparse";
import { useState } from 'react';

const getTreeId = (recording) => recording["Common Name"];
const getRandomColor = () => "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0");
const getDiameter = recording => recording["DBH (in)"] ? recording["DBH (in)"].split(".")[0] : 0;

export default function TreeWidths(){
  // static demoUrl = 'https://codesandbox.io/s/simple-line-chart-kec3v';
  const [treeRawData, setTreeRawData] = useState([]);
  const [treeChartData, setTreeChartData] = useState([]);
  const [treeLines, setDistinctTreeLines] = useState([])
  const changeHandler = (event) => {
    Papa.parse(event.target.files[0], {
      header: true, 
      skipEmptyLines: true,
      complete: function (results) {
        console.log(results.data)
        
        setTreeRawData(results.data)

        // Get distinct trees
        const treeIds = results.data.map(entry => getTreeId(entry));
        const distinctTreeIds = [...new Set(treeIds)];
        console.log(distinctTreeIds);

        // Get distinct diameters
        const diameters = results.data.map(entry => getDiameter(entry));
        const distinctDiameters = [...new Set(diameters)];
        console.log(distinctDiameters);

      /*  const dataPoints = distinctDates.map(date => {
          const dataPoint = {DATE: date};
          distinctTreeIds.forEach(treeId => dataPoint[treeId] = 0);
          return dataPoint;
        });
*/
        // Create a hash map of date:object, where the object has each kind of tree
        const dataPoints = {};
        distinctDiameters.forEach(diameter => {
          const dataPoint = {diameter: diameter};
          distinctTreeIds.forEach(treeId => dataPoint[treeId] = 0);
          dataPoints[diameter] = dataPoint;
        })
        console.log(dataPoints);

        // Update each object with how many of each tree we heard that day
        results.data.forEach(entry => {
          const treeId = getTreeId(entry);
          dataPoints[getDiameter(entry)][treeId]++;
        })

        // Convert the hashmap into a list
        const finalDataPointsList = Object.keys(dataPoints).map(diameter => {
          const final = {...dataPoints[diameter]};
          return final;
        })
        console.log(finalDataPointsList);

        setDistinctTreeLines(distinctTreeIds);
        setTreeChartData(finalDataPointsList);
      },
    });
  };

  // render() {
    return (
      <>
      {treeChartData && 
      <ResponsiveContainer width="100%" height="100%" minWidth="500px" minHeight="500px">
        <BarChart
          width={500}
          height={300}
          data={treeChartData}
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
          { treeLines.map(treeId => <Bar type="monotone" dataKey={treeId} fill={getRandomColor()}/>)}
        </BarChart>
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
