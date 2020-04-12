const { showData } = require('../show-data');

async function unitedStates(req, res) {
  const { countriesData } = await showData();
  const usData = countriesData.filter((datum) => datum.name === 'US');
  const latestEntry = usData[usData.length - 1];
  const totalPositive = latestEntry.positive.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
  const totalDeaths = latestEntry.deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
  const percentDeaths = latestEntry.percentDead;
  const percentTested = latestEntry.percentTested;
  const x  = usData.map((datum) => datum.date);
  const posY = usData.map((datum) => datum.positive);
  const deathsY = usData.map((datum) => datum.deaths);
  const addPosY = usData.map((datum) => datum.addedPositive);
  const addDeathsY = usData.map((datum) => datum.addedDeaths);
  const percentPosY = usData.map((datum) => datum.percentPositive);
  const percentDeathsY = usData.map((datum) => datum.percentDead);
  const percentTestedY = usData.map((datum) => datum.percentTested);
  const recoveredY = usData.map((datum) => datum.recovered);
  const percentRecoveredY = usData.map((datum) => datum.percentRecovered);
  const genericLayout = (title) => JSON.stringify({
    title,
    xaxis: {
      title: 'Date'
    },
    yaxis: {
      title
    }
  });
  const positiveLayout = genericLayout('Positive cases');
  const deathsLayout = genericLayout('Deaths');
  const additionalPositiveLayout = genericLayout('Added positive cases');
  const additionalDeathsLayout = genericLayout('Added deaths');
  const percentPositiveLayout = genericLayout('Percent positive cases');
  const percentDeathsLayout = genericLayout('Percent deaths');
  const percentTestedLayout = genericLayout('Percent tested');
  const recoveredLayout = genericLayout('Recovered');
  const percentRecoveredLayout = genericLayout('Percent recovered');
  const positiveData = JSON.stringify([{ x, y: posY, type: 'scatter', mode: 'lines', name: 'US' }]);
  const deathsData = JSON.stringify([{ x, y: deathsY, type: 'scatter', mode: 'lines', name: 'US' }]);
  const additionalPositiveData = JSON.stringify([{ x, y: addPosY, type: 'scatter', mode: 'lines', name: 'US' }]);
  const additionalDeathsData = JSON.stringify([{ x, y: addDeathsY, type: 'scatter', mode: 'lines', name: 'US' }]);
  const percentPositiveData = JSON.stringify([{ x, y: percentPosY, type: 'scatter', mode: 'lines', name: 'US' }]);
  const percentDeathsData = JSON.stringify([{ x, y: percentDeathsY, type: 'scatter', mode: 'lines', name: 'US' }]);
  const percentTestedData = JSON.stringify([{ x, y: percentTestedY, type: 'scatter', mode: 'lines', name: 'US' }]);
  const recoveredData = JSON.stringify([{ x, y: recoveredY, type: 'scatter', mode: 'lines', name: 'US' }]);
  const percentRecoveredData = JSON.stringify([{ x, y: percentRecoveredY, type: 'scatter', mode: 'lines', name: 'US' }]);

  res.render('united-states', {
    totalPositive,
    totalDeaths,
    percentDeaths,
    percentTested,
    positiveData,
    positiveLayout,
    deathsData,
    deathsLayout,
    additionalPositiveData,
    additionalPositiveLayout,
    additionalDeathsData,
    additionalDeathsLayout,
    percentPositiveLayout,
    percentDeathsLayout,
    percentTestedLayout,
    percentPositiveData,
    percentDeathsData,
    percentTestedData,
    recoveredLayout,
    percentRecoveredLayout,
    recoveredData,
    percentRecoveredData,
  });
}

module.exports = unitedStates;
