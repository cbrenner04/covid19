const { showData } = require("../show-data");
const { numericalDisplay, genericLayout } = require('./util');

async function illinois(req, res) {
  const { statesData } = await showData();
  const illinoisData = statesData.filter((datum) => datum.name === "IL");
  const latestEntry = illinoisData[illinoisData.length - 1];
  const totalPositive = numericalDisplay(latestEntry.totalPositive);
  const totalDeaths = numericalDisplay(latestEntry.totalDeaths);
  const totalPercentPositive = latestEntry.totalPercentPositive;
  const totalPercentDeaths = latestEntry.totalPercentDead;
  const totalTests = numericalDisplay(latestEntry.totalTested);
  const dates = illinoisData.map((datum) => datum.date);

  const dailyAvgPositiveData = illinoisData.map((datum) => datum.avgPositive);
  const dailyPositiveLayout = genericLayout("7 day average Positive Cases");
  const dailyPositiveData = JSON.stringify([
    {
      x: dates,
      y: dailyAvgPositiveData,
      type: "scatter",
      mode: "lines",
      name: "7 day running avg",
    },
  ]);

  const dailyAvgDeathData = illinoisData.map((datum) => datum.avgDeath);
  const dailyDeathLayout = genericLayout("7 day average Deaths");
  const dailyDeathData = JSON.stringify([
    {
      x: dates,
      y: dailyAvgDeathData,
      type: "scatter",
      mode: "lines",
      name: "7 day running avg",
    },
  ]);

  const dailyAvgPercentPositiveData = illinoisData.map((datum) => datum.avgPercentPositive);
  const dailyPercentPositiveLayout = genericLayout("7 day average Percent positive cases");
  const dailyPercentPositiveData = JSON.stringify([
    {
      x: dates,
      y: dailyAvgPercentPositiveData,
      type: "scatter",
      mode: "lines",
      name: "7 day running avg",
    },
    {
      x: dates,
      y: dates.map(() => 5),
      type: 'scatter',
      mode: 'lines',
      line: {
        dash: 'dot',
        width: 4,
      },
      name: 'Goal',
    },
  ]);

  const dailyAvgPercentDeathsData = illinoisData.map((datum) => datum.avgPercentDeaths);
  const dailyPercentDeathsLayout = genericLayout("7 day average Percent deaths");
  const dailyPercentDeathsData = JSON.stringify([
    {
      x: dates,
      y: dailyAvgPercentDeathsData,
      type: "scatter",
      mode: "lines",
      name: "7 day running avg",
    },
  ]);

  const hospitalizationData = illinoisData.map((datum) => datum.hospitalizedCurrently);
  const currentHospitalizationLayout = genericLayout("Current Hospitalizations");
  const currentHospitalizationData = JSON.stringify([
    {
      x: dates,
      y: hospitalizationData,
      type: "scatter",
      mode: "lines",
      name: "Count",
    },
  ]);

  const inIcuCurrently = illinoisData.map((datum) => datum.inIcuCurrently);
  const inIcuCurrentlyLayout = genericLayout("Current ICU stays");
  const inIcuCurrentlyData = JSON.stringify([
    {
      x: dates,
      y: inIcuCurrently,
      type: "scatter",
      mode: "lines",
      name: "Count",
    },
  ]);

  res.render("illinois", {
    totalPositive,
    totalDeaths,
    totalPercentPositive,
    totalPercentDeaths,
    totalTests,
    dailyPercentPositiveLayout,
    dailyPercentPositiveData,
    dailyPercentDeathsLayout,
    dailyPercentDeathsData,
    dailyPositiveLayout,
    dailyPositiveData,
    dailyDeathLayout,
    dailyDeathData,
    currentHospitalizationData,
    currentHospitalizationLayout,
    inIcuCurrentlyData,
    inIcuCurrentlyLayout,
  });
}

module.exports = illinois;
