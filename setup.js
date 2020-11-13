const { getHistoricalStateData, getHistoricalUSData } = require("./get-data");
const {
  connectToDB,
  disconnectFromDB,
  createStatesDataTable,
  createCountriesDataTable,
  insertIntoStates,
  insertIntoCountries,
} = require("./database");

function dateIntToISO(dateInt) {
  const date = dateInt.toString();
  const dateString = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`;
  return new Date(dateString).toISOString();
}

async function seedStatesData() {
  const stateData = await getHistoricalStateData();
  const allValues = stateData.map((datum) => {
    const dateValue = dateIntToISO(datum.date);
    return [
      datum.state,
      dateValue,
      datum.positiveIncrease,
      datum.deathIncrease,
      datum.totalTestResultsIncrease,
      datum.positive,
      datum.death,
      datum.totalTestResults,
      datum.hospitalizedCurrently,
      datum.inIcuCurrently,
    ];
  });
  for (values of allValues) {
    await insertIntoStates(values);
  }
}

async function seedCountriesData() {
  const countriesData = await getHistoricalUSData();
  const allValues = countriesData.map((datum) => {
    const dateValue = dateIntToISO(datum.date);
    return [
      "US",
      dateValue,
      datum.positiveIncrease,
      datum.deathIncrease,
      datum.totalTestResultsIncrease,
      datum.positive,
      datum.recovered,
      datum.death,
      datum.totalTestResults,
      datum.hospitalizedCurrently,
      datum.inIcuCurrently,
    ];
  });
  for (values of allValues) {
    await insertIntoCountries(values);
  }
}

async function main() {
  await connectToDB();
  await createStatesDataTable();
  await seedStatesData();
  await createCountriesDataTable();
  await seedCountriesData();
  await disconnectFromDB();
}

main()
  .then(() => {
    console.log("setup complete");
  })
  .catch((error) => {
    console.error(error);
  });
