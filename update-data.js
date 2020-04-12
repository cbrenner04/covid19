const { getCurrentStateData, getCurrentUSData } = require('./get-data');
const {
  connectToDB,
  disconnectFromDB,
  insertIntoStates,
  insertIntoCountries,
  selectLatestStatesData,
  selectLatestCountriesData,
} = require('./database');

const today = (new Date()).toDateString();

async function updateStatesData() {
  const data = await getCurrentStateData();
  for (datum of data) {
    const { state } = datum;
    const date = new Date(datum.dateChecked);
    const dateString = date.toDateString();

    if (dateString !== today) {
      console.log('not today')
      return;
    }

    const { date: latestResultDate } = await selectLatestStatesData(state);
    const latestResultDateString = (new Date(latestResultDate)).toDateString()

    if (latestResultDateString === dateString) {
      console.log('already recorded');
      return;
    }

    const dataValue = date.toISOString();
    const values = [state, dataValue, datum.positive, datum.death, datum.totalTestResults];
    await insertIntoStates(values);
  }
}

async function updateCountriesData() {
  const data = await getCurrentUSData();
  const date = new Date(data.lastModified);
  const dateString = date.toDateString();
  const name = 'US';

  if (dateString !== today) {
    console.log('not today');
    return;
  }

  const { date: latestResultDate } = await selectLatestCountriesData(name);
  const latestResultDateString = (new Date(latestResultDate)).toDateString()

  if (latestResultDateString === dateString) {
    console.log('already recorded');
    return;
  }

  const dataValue = date.toISOString();
  const values = [name, dataValue, data.positive, data.recovered, data.death, data.totalTestResults];
  await insertIntoCountries(values);
}

async function main() {
  await connectToDB();
  await updateStatesData();
  await updateCountriesData();
  await disconnectFromDB();
}

main()
  .then(() => {
    console.log('daily update complete');
  })
  .catch((error) => {
    console.error(error);
  });
