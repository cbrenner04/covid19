const {
  connectToDB,
  disconnectFromDB,
  selectAllStatesData,
  selectAllCountriesData,
} = require("./database");

let statesData;
let countriesData;
let initialStatesData;
let initialCountriesData;

async function setInitialData() {
  await connectToDB();
  initialStatesData = await selectAllStatesData();
  initialCountriesData = await selectAllCountriesData();
  await disconnectFromDB();
}

const toPercent = (float, precision) => Number((float * 100).toFixed(precision));

function setStatesData() {
  statesData = initialStatesData.map((datum) => {
    const {
      name,
      date,
      positive,
      deaths,
      tested,
      total_positive,
      total_deaths,
      total_tested,
      avgPercentPositive,
      avgPercentDeaths,
      avgPositive,
      avgDeath,
      hospitalized_currently,
      in_icu_currently,
    } = datum;
    const returnObj = {
      name,
      date,
      positive,
      deaths,
      tested,
      totalPositive: total_positive,
      totalDeaths: total_deaths,
      totalTested: total_tested,
      avgPositive,
      avgDeath,
      hospitalizedCurrently: hospitalized_currently,
      inIcuCurrently: in_icu_currently,
    };
    returnObj.totalPercentPositive = toPercent(total_positive / total_tested, 2);
    returnObj.totalPercentDead = toPercent((total_deaths || 0) / total_positive, 2);
    returnObj.percentPositive = toPercent(positive / tested, 2);
    returnObj.percentDead = toPercent((deaths || 0) / positive, 2);
    returnObj.avgPercentPositive = toPercent(avgPercentPositive, 2);
    returnObj.avgPercentDeaths = toPercent(avgPercentDeaths, 2);

    return returnObj;
  });
}

function setCountriesData() {
  countriesData = initialCountriesData.map((datum, index) => {
    const {
      name,
      date,
      positive,
      deaths,
      tested,
      total_positive,
      total_deaths,
      total_tested,
      avgPercentPositive,
      avgPercentDeaths,
      avgPositive,
      avgDeaths,
      hospitalized_currently,
      in_icu_currently,
    } = datum;
    const returnObj = {
      name,
      date,
      positive,
      deaths,
      tested,
      totalPositive: total_positive,
      totalDeaths: total_deaths,
      totalTested: total_tested,
      avgPositive,
      avgDeaths,
      hospitalizedCurrently: hospitalized_currently,
      inIcuCurrently: in_icu_currently,
    };
    returnObj.totalPercentPositive = toPercent(total_positive / total_tested, 2);
    returnObj.totalPercentDead = toPercent((total_deaths || 0) / total_positive, 2);
    returnObj.percentPositive = toPercent(positive / tested, 2);
    returnObj.percentDead = toPercent((deaths || 0) / positive, 2);
    returnObj.avgPercentPositive = toPercent(avgPercentPositive, 2);
    returnObj.avgPercentDeaths = toPercent(avgPercentDeaths, 2);

    return returnObj;
  });
}

async function showData() {
  await setInitialData();
  setStatesData();
  setCountriesData();

  return { statesData, countriesData };
}

module.exports = { showData };
