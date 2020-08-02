const { showData } = require("../show-data");

function numericalDisplay(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function genericLayout(title) {
  return JSON.stringify({
    title,
    xaxis: {
      title: "Date",
    },
    yaxis: {
      title,
    },
    showlegend: false,
  });
}
function genericScatter(dates, data) {
  return JSON.stringify([
    { x: dates, y: data, type: "scatter", mode: "lines", name: "IL" },
  ]);
}

async function illinois(req, res) {
  const { statesData } = await showData();
  const illinoisData = statesData.filter((datum) => datum.name === "IL");
  const latestEntry = illinoisData[illinoisData.length - 1];
  const totalPositive = numericalDisplay(latestEntry.totalpositive);
  const totalDeaths = numericalDisplay(latestEntry.totaldeaths);
  const totalPercentPositive = latestEntry.totalPercentPositive;
  const totalPercentDeaths = latestEntry.totalPercentDead;
  const totalPercentTested = latestEntry.totalPercentTested;

  const dates = illinoisData.map((datum) => datum.date);

  const dailyPositiveCases = illinoisData.map((datum) => datum.positive);
  const dailyPositiveCasesLayout = genericLayout("Daily positive cases");
  const dailyPositiveCasesData = genericScatter(dates, dailyPositiveCases);

  const dailyDeaths = illinoisData.map((datum) => datum.deaths);
  const dailyDeathsLayout = genericLayout("Daily deaths");
  const dailyDeathsData = genericScatter(dates, dailyDeaths);

  const dailyPercentPositive = illinoisData.map(
    (datum) => datum.percentPositive
  );
  const dailyAvgPercentPositiveData = illinoisData.map(
    (datum) => datum.avgPercentPositive
  );
  const dailyPercentPositiveLayout = genericLayout("Percent positive cases");
  const dailyPercentPositiveData = JSON.stringify([
    {
      x: dates,
      y: dailyPercentPositive,
      type: "scatter",
      mode: "lines",
      name: "Daily",
    },
    {
      x: dates,
      y: dailyAvgPercentPositiveData,
      type: "scatter",
      mode: "lines",
      name: "14 day running avg",
    },
  ]);

  const dailyPercentDeaths = illinoisData.map((datum) => datum.percentDead);
  const dailyAvgPercentDeathsData = illinoisData.map(
    (datum) => datum.avgPercentDeaths
  );
  const dailyPercentDeathsLayout = genericLayout("Percent deaths");
  const dailyPercentDeathsData = JSON.stringify([
    {
      x: dates,
      y: dailyPercentDeaths,
      type: "scatter",
      mode: "lines",
      name: "Daily",
    },
    {
      x: dates,
      y: dailyAvgPercentDeathsData,
      type: "scatter",
      mode: "lines",
      name: "14 day running avg",
    },
  ]);

  res.render("illinois", {
    totalPositive,
    totalDeaths,
    totalPercentPositive,
    totalPercentDeaths,
    totalPercentTested,
    dailyPositiveCasesLayout,
    dailyPositiveCasesData,
    dailyDeathsLayout,
    dailyDeathsData,
    dailyPercentPositiveLayout,
    dailyPercentPositiveData,
    dailyPercentDeathsLayout,
    dailyPercentDeathsData,
  });
}

module.exports = illinois;
