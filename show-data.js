const {
  connectToDB,
  disconnectFromDB,
  selectAllStatesData,
  selectAllCountriesData,
} = require('./database');

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

const toPercent = (float, precision) => Number((float * 100).toFixed(precision));

function setStatesData() {
  statesData = initialStatesData.map((datum, index) => {
    const { name, date, positive, deaths, totaltested } = datum;
    const returnObj = { name, date, positive, deaths, totaltested };
    returnObj.percentPositive = toPercent((positive / totaltested), 2);
    returnObj.percentDead = toPercent(((deaths || 0) / positive), 2);
    returnObj.percentTested = toPercent((totaltested / statePopulations[name]), 5);

    const previousDay = initialStatesData[index - 1];

    if (!previousDay || previousDay.name !== name) return returnObj;

    returnObj.addedPositive = positive - previousDay.positive;
    returnObj.addedDeaths = (deaths || 0) - previousDay.deaths;

    return returnObj;
  });
}

function setCountriesData() {
  countriesData = initialCountriesData.map((datum, index) => {
    const { name, date, positive, recovered, deaths, totaltested } = datum;
    const returnObj = { name, date, positive, recovered, deaths, totaltested };
    const previousDay = initialCountriesData[index - 1];
    returnObj.percentPositive = toPercent((positive / totaltested), 2);
    returnObj.percentRecovered = toPercent(((recovered || 0) / positive), 2);
    returnObj.percentDead = toPercent(((deaths || 0) / positive), 2);
    returnObj.percentTested = toPercent((totaltested / countryPopulations[name]), 5);

    if (!previousDay) return returnObj;

    returnObj.addedPositive = positive - previousDay.positive;
    returnObj.addedDeaths = (deaths || 0) - previousDay.deaths;

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
  }
}

module.exports = {
  showData,
};
