const { showData } = require("../show-data");

async function states(req, res) {
  const { statesData } = await showData();
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
    MD: statesData
    .filter((datum) => datum.name === "MD")
    .map((datum) => datum.date),
    DC: statesData
    .filter((datum) => datum.name === "DC")
    .map((datum) => datum.date),
  };
  let dailyPositiveData = [];
  let dailyDeathsData = [];
  let currentHospitalizationData = [];
  let currentIcuData = [];
  let avgPercentPositiveData = [
    {
      x: dates.IL,
      y: dates.IL.map(() => 5),
      type: 'scatter',
      mode: 'lines',
      line: {
        dash: 'dot',
        width: 4,
      },
      name: 'Goal',
    },
  ];
  let avgPercentDeathsData = [];
  statesData.forEach((datum) => {
    const {
      name,
      avgPercentPositive,
      avgPercentDeaths,
      avgPositive,
      avgDeath,
      hospitalizedCurrently,
      inIcuCurrently,
    } = datum;
    const dailyPositiveI = dailyPositiveData.findIndex((d) => d.name === name);
    if (dailyPositiveI < 0) {
      dailyPositiveData.push({
        x: dates[name],
        y: [avgPositive],
        type: "scatter",
        mode: "lines",
        name,
      });
    } else {
      dailyPositiveData[dailyPositiveI].y.push(avgPositive);
    }
    const dailyDeathsI = dailyDeathsData.findIndex((d) => d.name === name);
    if (dailyDeathsI < 0) {
      dailyDeathsData.push({
        x: dates[name],
        y: [avgDeath],
        type: "scatter",
        mode: "lines",
        name,
      });
    } else {
      dailyDeathsData[dailyDeathsI].y.push(avgDeath);
    }
    const avgPercentPositiveI = avgPercentPositiveData.findIndex((d) => d.name === name);
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
    // // TODO: can we be more programmatic about what we consider outliers and how we handle them?
    if (avgPercentDeaths < 20) {
      const avgPercentDeathI = avgPercentDeathsData.findIndex((d) => d.name === name);
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
    const currentHospitalizationsI = currentHospitalizationData.findIndex((d) => d.name === name);
    if (currentHospitalizationsI < 0) {
      currentHospitalizationData.push({
        x: dates[name],
        y: [hospitalizedCurrently],
        type: "scatter",
        mode: "lines",
        name,
      });
    } else {
      currentHospitalizationData[currentHospitalizationsI].y.push(hospitalizedCurrently);
    }
    const currentIcuI = currentIcuData.findIndex((d) => d.name === name);
    if (currentIcuI < 0) {
      currentIcuData.push({
        x: dates[name],
        y: [inIcuCurrently],
        type: "scatter",
        mode: "lines",
        name,
      });
    } else {
      currentIcuData[currentIcuI].y.push(inIcuCurrently);
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
  const positiveLayout = genericLayout("7 day average Positive Cases");
  const deathsLayout = genericLayout("7 day average Deaths");
  const avgPercentPositiveLayout = genericLayout("7 day avg percent positive");
  const avgPercentDeathLayout = genericLayout("7 day avg percent deaths");
  const currentHospitalizationLayout = genericLayout("Current Hospitalizations");
  const currentIcuLayout = genericLayout("Current ICU stays");
  dailyPositiveData = JSON.stringify(dailyPositiveData);
  dailyDeathsData = JSON.stringify(dailyDeathsData);
  avgPercentPositiveData = JSON.stringify(avgPercentPositiveData);
  avgPercentDeathsData = JSON.stringify(avgPercentDeathsData);
  currentHospitalizationData = JSON.stringify(currentHospitalizationData);
  currentIcuData = JSON.stringify(currentIcuData);
  res.render("states", {
    dailyPositiveData,
    positiveLayout,
    dailyDeathsData,
    deathsLayout,
    avgPercentPositiveLayout,
    avgPercentPositiveData,
    avgPercentDeathLayout,
    avgPercentDeathsData,
    currentHospitalizationLayout,
    currentHospitalizationData,
    currentIcuLayout,
    currentIcuData,
  });
}

module.exports = states;
