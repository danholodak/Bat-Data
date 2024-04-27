import FileInput from "./FileInput";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from "recharts";
import Papa from "papaparse";
import { useState, useEffect } from "react";
import { colorPalette } from "../assets/chartColorPalette";
import { getRandomColor } from "../utils";
import { data } from "./sampledata";

export default function BatsVTreeSpecies({ chartTitle }) {
  const [uploadedFile, setBatRawData] = useState({})
  const [treeRawData, setTreeRawData] = useState({})
  const [chartData, setChartData] = useState([])
  const [colors, setColors] = useState(colorPalette)
  const [lines, setLines] = useState([])

  const onFileUpload = (event) => {
    console.log("onFileUpload", event);
    if (event.target.files[0]) {
      setBatRawData(event.target.files[0]);
    }
  };  

  const updateChart = () => {
    console.log("updateChart", uploadedFile);
    if (!uploadedFile) {
      return;
    }
/*
    if (uploadedFile.name.startsWith("bat")) {

    } else if (uploadedFile.name.startsWith("tree")) {

    } else {
        return;
    }*/

    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        console.log("data", results.data);
        
      },
    });
  };

  useEffect(() => {
    updateChart();
  }, [uploadedFile, updateChart]);


  return (
    <>
      <section className="theChart">
        <h1>{chartTitle}</h1>
        {data && (
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth="500px"
            minHeight="500px"
          >
            <LineChart
              width={500}
              height={300}
              data={data}
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

              {lines.map((id, i) => (
                <Line
                  key={id + i}
                  type="monotone"
                  dataKey={id}
                  stroke={
                    i >= colors.length
                      ? getRandomColor()
                      : colors[i]
                  }
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </section>
      <FileInput changeHandler={onFileUpload}></FileInput>
    </>
  );
}
