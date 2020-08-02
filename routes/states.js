const { showData } = require("../show-data");

async function states(req, res) {
  const { statesData } = await showData();
  // using illinois just to get dates
  const dates = {
    IL: statesData
      .filter((datum) => datum.name === "IL")
      .map((datum) => datum.date),
    MN: statesData
      .filter((datum) => datum.name === "MN")
      .map((datum) => datum.date),
    MI: statesData
      .filter((datum) => datum.name === "MI")
      .map((datum) => datum.date),
    OH: statesData
      .filter((datum) => datum.name === "OH")
      .map((datum) => datum.date),
    NY: statesData
      .filter((datum) => datum.name === "NY")
      .map((datum) => datum.date),
  };
  let dailyPositiveData = [];
  let dailyDeathsData = [];
  let percentPositiveData = [];
  let percentDeathsData = [];
  let avgPercentPositiveData = [];
  let avgPercentDeathsData = [];
  statesData.forEach((datum) => {
    const {
      name,
      positive,
      deaths,
      percentPositive,
      percentDead,
      avgPercentPositive,
      avgPercentDeaths,
    } = datum;
    const dailyPositiveI = dailyPositiveData.findIndex((d) => d.name === name);
    if (dailyPositiveI < 0) {
      dailyPositiveData.push({
        x: dates[name],
        y: [positive],
        type: "scatter",
        mode: "lines",
        name,
      });
    } else {
      dailyPositiveData[dailyPositiveI].y.push(positive);
    }
    const dailyDeathsI = dailyDeathsData.findIndex((d) => d.name === name);
    if (dailyDeathsI < 0) {
      dailyDeathsData.push({
        x: dates[name],
        y: [deaths],
        type: "scatter",
        mode: "lines",
        name,
      });
    } else {
      dailyDeathsData[dailyDeathsI].y.push(deaths);
    }
    if (percentPositive < 50) {
      const percentPositiveI = percentPositiveData.findIndex(
        (d) => d.name === name
      );
      if (percentPositiveI < 0) {
        percentPositiveData.push({
          x: dates[name],
          y: [percentPositive],
          type: "scatter",
          mode: "lines",
          name,
        });
      } else {
        percentPositiveData[percentPositiveI].y.push(percentPositive);
      }
    }
    if (percentDead < 30) {
      const percentDeathsI = percentDeathsData.findIndex(
        (d) => d.name === name
      );
      if (percentDeathsI < 0) {
        percentDeathsData.push({
          x: dates[name],
          y: [percentDead],
          type: "scatter",
          mode: "lines",
          name,
        });
      } else {
        percentDeathsData[percentDeathsI].y.push(percentDead);
      }
    }
    const avgPercentPositiveI = avgPercentPositiveData.findIndex(
      (d) => d.name === name
    );
    if (avgPercentPositiveI < 0) {
      avgPercentPositiveData.push({
        x: dates[name],
        y: [avgPercentPositive],
        type: "scatter",
        mode: "lines",
        name,
      });
    } else {
      avgPercentPositiveData[avgPercentPositiveI].y.push(avgPercentPositive);
    }
    if (avgPercentDeaths < 20) {
      const avgPercentDeathI = avgPercentDeathsData.findIndex(
        (d) => d.name === name
      );
      if (avgPercentDeathI < 0) {
        avgPercentDeathsData.push({
          x: dates[name],
          y: [avgPercentDeaths],
          type: "scatter",
          mode: "lines",
          name,
        });
      } else {
        avgPercentDeathsData[avgPercentDeathI].y.push(avgPercentDeaths);
      }
    }
  });
  const genericLayout = (title) =>
    JSON.stringify({
      title,
      xaxis: {
        title: "Date",
      },
      yaxis: {
        title,
      },
    });
  const positiveLayout = genericLayout("Daily positive cases");
  const deathsLayout = genericLayout("Daily deaths");
  const percentPositiveLayout = genericLayout("Daily percent positive cases");
  const percentDeathsLayout = genericLayout("Daily percent deaths");
  const avgPercentPositiveLayout = genericLayout("14 day avg percent positive");
  const avgPercentDeathLayout = genericLayout("14 day avg percent deaths");
  dailyPositiveData = JSON.stringify(dailyPositiveData);
  dailyDeathsData = JSON.stringify(dailyDeathsData);
  percentPositiveData = JSON.stringify(percentPositiveData);
  percentDeathsData = JSON.stringify(percentDeathsData);
  avgPercentPositiveData = JSON.stringify(avgPercentPositiveData);
  avgPercentDeathsData = JSON.stringify(avgPercentDeathsData);
  res.render("states", {
    dailyPositiveData,
    positiveLayout,
    dailyDeathsData,
    deathsLayout,
    percentPositiveLayout,
    percentPositiveData,
    percentDeathsLayout,
    percentDeathsData,
    avgPercentPositiveLayout,
    avgPercentPositiveData,
    avgPercentDeathLayout,
    avgPercentDeathsData,
  });
}

module.exports = states;
