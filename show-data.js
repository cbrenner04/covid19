const {
  connectToDB,
  disconnectFromDB,
  selectAllStatesData,
  selectAllCountriesData,
} = require("./database");

const statePopulations = {
  IL: 12670000,
  OH: 11690000,
  MN: 5640000,
  MI: 9987000,
  NY: 19450000,
};

const countryPopulations = {
  US: 328200000,
};

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

const toPercent = (float, precision) =>
  Number((float * 100).toFixed(precision));

function setStatesData() {
  statesData = initialStatesData.map((datum, index) => {
    const {
      name,
      date,
      positive,
      deaths,
      tested,
      totalpositive,
      totaldeaths,
      totaltested,
      avgPercentPositive,
      avgPercentDeaths,
    } = datum;
    const returnObj = {
      name,
      date,
      positive,
      deaths,
      tested,
      totalpositive,
      totaldeaths,
      totaltested,
    };
    returnObj.totalPercentPositive = toPercent(totalpositive / totaltested, 2);
    returnObj.totalPercentDead = toPercent(
      (totaldeaths || 0) / totalpositive,
      2
    );
    returnObj.totalPercentTested = toPercent(
      totaltested / statePopulations[name],
      5
    );
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
      totalpositive,
      totalrecovered,
      totaldeaths,
      totaltested,
      avgPercentPositive,
      avgPercentDeaths,
    } = datum;
    const returnObj = {
      name,
      date,
      positive,
      deaths,
      tested,
      totalpositive,
      totaldeaths,
      totaltested,
      totalrecovered,
    };
    returnObj.totalPercentPositive = toPercent(totalpositive / totaltested, 2);
    returnObj.totalPercentDead = toPercent(
      (totaldeaths || 0) / totalpositive,
      2
    );
    returnObj.totalPercentTested = toPercent(
      totaltested / countryPopulations[name],
      5
    );
    returnObj.percentRecovered = toPercent(
      (totalrecovered || 0) / totalpositive,
      2
    );
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

  return {
    statesData,
    countriesData,
  };
}

module.exports = {
  showData,
};
