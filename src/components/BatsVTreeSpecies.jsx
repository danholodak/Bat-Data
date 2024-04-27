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
import { getLinesFromChartData, getBatId, getTreeId } from "../utils";

export default function BatsVTreeSpecies({ chartTitle }) {
  const [parkLines, setParkLines] = useState(["batCount", "treeCount"]);
  const [batId, setBatId] = useState();
  const [treeId, setTreeId] = useState();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [colors, setColors] = useState(colorPalette);

  let numFiles = 0;
  let finishedFiles = 0;

  const onFileUpload = (event) => {
    console.log("onFileUpload", event);
    if (event.target.files) {
      setUploadedFiles(Object.values(event.target.files));
    }
  };

  const calculateLinesWhenFinished = (parks) => {
    console.log("calculateLinesWhenFinished", finishedFiles, numFiles);
    finishedFiles++;
    if (finishedFiles < numFiles) {
      console.log("returning early");
      return;
    }

    // fucking hell this has to happen somehow after the "COMPLETE" of the parsing
    // callbacks are garbage
    console.log("parks", parks);
    if ("VCP" in parks) {
      console.log("VCP", parks["VCP"]);
    }
    const lines = getLinesForBatAndTree(parks);
    console.log("lines", lines);
    setChartData(lines);
    // setParkLines(Object.keys(parks));
  };

  const updateChart = () => {
    console.log("updateChart", uploadedFiles);
    if (!uploadedFiles) {
      return;
    }

    const batFiles = uploadedFiles.filter((file) =>
      file.name.startsWith("bat"),
    );
    const treeFiles = uploadedFiles.filter((file) =>
      file.name.startsWith("tree"),
    );
    console.log("batFiles", batFiles);
    console.log("treeFiles", treeFiles);

    const parks = {};
    numFiles = batFiles.length + treeFiles.length;

    batFiles.forEach((file) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (sheet) {
          console.log("data for " + file.name, sheet.data);
          // For each recording, if we haven't seen this batId before
          // Register it
          // For this batId, if we haven't seen this park before, make a new entry
          // Then increment how many bats we have for this park
          sheet.data
            .filter((recording) => recording["PARK"])
            .forEach((recording) => {
              const park = recording["PARK"];
              //  console.log("parkId", park);
              const batId = getBatId(recording);
              if (!(park in parks)) {
                parks[park] = {
                  bats: {},
                  trees: {},
                };
              }
              //  console.log("added park", parks[park]);
              if (!(batId in parks[park].bats)) {
                parks[park].bats[batId] = {
                  count: 0,
                };
              }

              parks[park].bats[batId].count++;
            });
          calculateLinesWhenFinished(parks);
        },
      });
    });

    treeFiles.forEach((file) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (sheet) {
          console.log("data for " + file.name, sheet.data);
          // For each tree, if we haven't seen the park before add it
          // And if we haven't seen this tree at this park before, add that
          // And then increment the count
          sheet.data
            .filter((treeMeasurement) => treeMeasurement["PARK"])
            .forEach((treeMeasurement) => {
              const park = treeMeasurement["PARK"];
              // console.log("parkId", park);
              const treeId = getTreeId(treeMeasurement);
              if (!(park in parks)) {
                parks[park] = {
                  bats: {},
                  trees: {},
                };
              }
              if (!(treeId in parks[park].trees)) {
                parks[park].trees[treeId] = {
                  count: 0,
                };
              }

              parks[park].trees[treeId].count++;
            });
          calculateLinesWhenFinished(parks);
        },
      });
    });

    // Now we have a nice data structure of parks by name, each with a map of bats:count and trees:count
    // So now, for a given bat or tree
    // we can go ahead and figure it out
  };

  const getLinesForBatAndTree = (parks) => {
    const lines = Object.keys(parks).map((parkName) => {
      const park = parks[parkName];
      console.log("park", park);
      // TODO: use _.get() to make this safe
      if (!(batId in park.bats) || !(treeId in park.trees)) {
        return null;
      }
      return {
        name: parkName,
        batCount: park.bats[batId].count,
        treeCount: park.trees[treeId].count,
      };
    });
    console.log("lines unfiltered", lines);
    return lines.filter((line) => line != null);
  };

  useEffect(() => {
    updateChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedFiles, treeId, batId]);

  return (
    <>
      <section className="theChart">
        <h1>{chartTitle}</h1>
        {chartData && (
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth="500px"
            minHeight="500px"
          >
            <LineChart
              width={500}
              height={300}
              data={chartData}
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
              {getLinesFromChartData(parkLines, colors)}
            </LineChart>
          </ResponsiveContainer>
        )}
      </section>
      <FileInput changeHandler={onFileUpload}></FileInput>
      <label>
        {" "}
        Choose a batId:
        <input
          id="batIdInput"
          type="text"
          onChange={(e) => setBatId(e.target.value)}
        />
      </label>
      <label>
        {" "}
        Choose a treeId:
        <input
          id="treeIdInput"
          type="text"
          onChange={(e) => setTreeId(e.target.value)}
        />
      </label>
    </>
  );
}
