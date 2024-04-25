import FileInput from "./FileInput";

import {
  BarChart,
  Bar,
  Rectangle,
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

export default function BatsVTreeSpecies({ chartTitle }) {
  const data = [
    {
      name: "Page A",
      uv: 40,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 30,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 20,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 27,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 18,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 23,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 34,
      pv: 4300,
      amt: 2100,
    },
  ];

  return (
    <>
      <section className="theChart">
        <h1>{chartTitle}</h1>
        <ResponsiveContainer
          width="100%"
          height="100%"
          minHeight="500px"
          minWidth="500px"
        >
          <BarChart
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
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* <Bar dataKey="uv" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} barSize={20}/> */}
            <Bar
              dataKey="uv"
              fill="#82ca9d"
              activeBar={<Rectangle fill="gold" stroke="purple" />}
            />
          </BarChart>
        </ResponsiveContainer>
      </section>
      <FileInput></FileInput>
    </>
  );
}
