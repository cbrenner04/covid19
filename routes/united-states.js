const { showData } = require("../show-data");
const { genericLayout, numericalDisplay } = require('./util');

async function unitedStates(req, res) {
  const { countriesData } = await showData();
  const usData = countriesData.filter((datum) => datum.name === "US");
  const latestEntry = usData[usData.length - 1];
  const totalPositive = numericalDisplay(latestEntry.totalPositive);
  const totalDeaths = numericalDisplay(latestEntry.totalDeaths);
  const totalRecovered = numericalDisplay(latestEntry.totalRecovered);
  const totalPercentPositive = latestEntry.totalPercentPositive;
  const totalPercentDeaths = latestEntry.totalPercentDead;
  const totalTests = numericalDisplay(latestEntry.totalTested);
  const totalPercentRecovered = latestEntry.percentRecovered;

  const dates = usData.map((datum) => datum.date);

  const dailyAvgPositiveData = usData.map((datum) => datum.avgPositive);
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

  const dailyAvgDeathData = usData.map((datum) => datum.avgDeaths);
  const dailyDeathsLayout = genericLayout("7 day average Deaths");
  const dailyDeathsData = JSON.stringify([
    {
      x: dates,
      y: dailyAvgDeathData,
      type: "scatter",
      mode: "lines",
      name: "7 day running avg",
    },
  ]);

  const dailyAvgPercentPositiveData = usData.map((datum) => datum.avgPercentPositive);
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

  const dailyAvgPercentDeathsData = usData.map((datum) => datum.avgPercentDeaths);
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

  const hospitalizationData = usData.map((datum) => datum.hospitalizedCurrently);
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

  const inIcuCurrently = usData.map((datum) => datum.inIcuCurrently);
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

  res.render("united-states", {
    totalPositive,
    totalDeaths,
    totalPercentPositive,
    totalPercentDeaths,
    totalTests,
    dailyPositiveLayout,
    dailyPositiveData,
    dailyDeathsLayout,
    dailyDeathsData,
    dailyPercentPositiveLayout,
    dailyPercentPositiveData,
    dailyPercentDeathsLayout,
    dailyPercentDeathsData,
    totalRecovered,
    totalPercentRecovered,
    currentHospitalizationLayout,
    currentHospitalizationData,
    inIcuCurrentlyLayout,
    inIcuCurrentlyData,
  });
}

module.exports = unitedStates;
