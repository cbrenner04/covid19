const request = require("request-promise-native");

const filter = (d) => ["IL", "OH", "MI", "NY", "MN"].includes(d.state);
const getData = async (which, what) =>
  JSON.parse(
    await request(`https://covidtracking.com/api/v1/${which}/${what}.json`)
  );

const getHistoricalStateData = async () => {
  const data = await getData("states", "daily");
  return data.filter(filter);
};

const getCurrentStateData = async () => {
  const data = await getData("states", "current");
  return data.filter(filter);
};

const getHistoricalUSData = async () => getData("us", "daily");

const getCurrentUSData = async () => {
  const data = await getData("us", "current");
  return data[0];
};

module.exports = {
  getHistoricalStateData,
  getCurrentStateData,
  getHistoricalUSData,
  getCurrentUSData,
};
