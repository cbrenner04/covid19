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
    {
      x: dates,
      y: data,
      type: "scatter",
      mode: "lines",
      name: "IL",
    },
  ]);
}

async function unitedStates(req, res) {
  const { countriesData } = await showData();
  const usData = countriesData.filter((datum) => datum.name === "US");
  const latestEntry = usData[usData.length - 1];
  const totalPositive = numericalDisplay(latestEntry.totalpositive);
  const totalDeaths = numericalDisplay(latestEntry.totaldeaths);
  const totalRecovered = numericalDisplay(latestEntry.totalrecovered);
  const totalPercentPositive = latestEntry.totalPercentPositive;
  const totalPercentDeaths = latestEntry.totalPercentDead;
  const totalPercentTested = latestEntry.totalPercentTested;
  const totalPercentRecovered = latestEntry.percentRecovered;

  const dates = usData.map((datum) => datum.date);

  const dailyPositiveCases = usData.map((datum) => datum.positive);
  const dailyPositiveCasesLayout = genericLayout("Daily positive cases");
  const dailyPositiveCasesData = genericScatter(dates, dailyPositiveCases);

  const dailyDeaths = usData.map((datum) => datum.deaths);
  const dailyDeathsLayout = genericLayout("Daily deaths");
  const dailyDeathsData = genericScatter(dates, dailyDeaths);

  const dailyPercentPositive = usData.map((datum) => datum.percentPositive);
  const dailyAvgPercentPositiveData = usData.map(
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

  const dailyPercentDeaths = usData.map((datum) => datum.percentDead);
  const dailyAvgPercentDeathsData = usData.map(
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
      name: "7 day running avg",
    },
  ]);

  res.render("united-states", {
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
    totalRecovered,
    totalPercentRecovered,
  });
}

module.exports = unitedStates;
