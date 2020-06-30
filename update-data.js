const { getCurrentStateData, getCurrentUSData } = require('./get-data');
const {
  connectToDB,
  disconnectFromDB,
  insertIntoStates,
  insertIntoCountries,
  selectLatestStatesData,
  selectLatestCountriesData,
} = require('./database');

const FIVE_HOURS = 1000 * 60 * 60 * 5;
const today = (new Date(new Date().getTime() - FIVE_HOURS)).toDateString();

async function updateStatesData() {
  const data = await getCurrentStateData();
  for (datum of data) {
    const { state } = datum;
    const date = (new Date(new Date(datum.dateChecked).getTime() + FIVE_HOURS)).toDateString();

    if (date !== today) {
      console.log('not today')
      continue;
    }

    const { date: latestResultDate } = await selectLatestStatesData(state);
    const latestResultDateString = (new Date(new Date(latestResultDate).getTime() + FIVE_HOURS)).toDateString()

    if (latestResultDateString === date) {
      console.log('already recorded');
      continue;
    }

    const values = [state, datum.dateChecked, datum.positive, datum.death, datum.totalTestResults];
    await insertIntoStates(values);
  }
}

async function updateCountriesData() {
  const data = await getCurrentUSData();
  const date = (new Date(new Date(data.lastModified).getTime() + FIVE_HOURS)).toDateString();
  const name = 'US';

  if (date !== today) {
    console.log('not today');
    return;
  }

  const { date: latestResultDate } = await selectLatestCountriesData(name);
  const latestResultDateString = (new Date(new Date(latestResultDate).getTime() + FIVE_HOURS)).toDateString()

  if (latestResultDateString === date) {
    console.log('already recorded');
    return;
  }

  const values = [name, data.lastModified, data.positive, data.recovered, data.death, data.totalTestResults];
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
