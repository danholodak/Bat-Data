import { Line } from "recharts";

export const getRandomColor = () =>
  "#" + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, "0");

export const getTreeId = (treeMeasurement) => treeMeasurement["Common Name"];

export const getBatId = (recording) =>
  recording["MANUAL ID"] ||
  recording["AUTO ID"] ||
  recording["ALTERNATE 1"] ||
  recording["ALTERNATE 2"] ||
  "Unidentified";

export const getDistinctBatIdsFromSheet = (sheet) => {
  const batIds = sheet.data.map((recording) => getBatId(recording));
  const distinctBatIds = [...new Set(batIds)];
  console.log("distinctBatIds", distinctBatIds);
  return distinctBatIds;
};

export const getTimePoint = (recording, timeUnit) => {
  if (timeUnit === "day") {
    return `${recording.DATE}`;
  }

  if (timeUnit === "hour") {
    return `${recording.DATE} ${recording.HOUR}:00`;
  }

  if (timeUnit === "halfHour") {
    const minutes = parseInt(recording.TIME?.split(":")[1]);
    const minuteGroup = minutes > 30 ? "30" : "00";
    const time = `${recording.HOUR}:${minuteGroup}`;
    return `${recording.DATE} ${time}`;
  }

  // 10 minutes
  const minutes = parseInt(recording.TIME?.split(":")[1]);
  const time = `${recording.HOUR}:${Math.floor(minutes / 10)}0`;
  return `${recording.DATE} ${time}`;
};

const renderListOfUserNames = (names) => {
  return names.map((name) => <li>{name}</li>);
};

export const getLinesFromChartData = (chartData, colorPalette) => {
  console.log("getLinesFromChartData:chartData", chartData);
  return chartData.map((id, i) => (
    <Line
      key={id + i}
      type="monotone"
      dataKey={id}
      stroke={i >= colorPalette.length ? getRandomColor() : colorPalette[i]}
    />
  ));
};
