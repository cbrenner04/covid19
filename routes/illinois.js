const { showData } = require('../show-data');

function daysToDouble(positiveCounts) {
  const doubleCounts = [];
  positiveCounts.map((pos, index) => {
    const doubledIndex = positiveCounts.findIndex(d => (d >= pos * 2));
    if (doubledIndex >= 0) {
      const count = doubledIndex - index;
      doubleCounts.push(count);
    }
  });
  return doubleCounts;
}

async function illinois(req, res) {
  const { statesData } = await showData();
  const illinoisData = statesData.filter((datum) => datum.name === 'IL');
  const latestEntry = illinoisData[illinoisData.length - 1];
  const totalPositive = latestEntry.positive.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
  const totalDeaths = latestEntry.deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
  const percentDeaths = latestEntry.percentDead;
  const percentTested = latestEntry.percentTested;
  const x  = illinoisData.map((datum) => datum.date);
  const posY = illinoisData.map((datum) => datum.positive);
  const deathsY = illinoisData.map((datum) => datum.deaths);
  const addPosY = illinoisData.map((datum) => datum.addedPositive);
  const addDeathsY = illinoisData.map((datum) => datum.addedDeaths);
  const percentPosY = illinoisData.map((datum) => datum.percentPositive);
  const percentDeathsY = illinoisData.map((datum) => datum.percentDead);
  const percentTestedY = illinoisData.map((datum) => datum.percentTested);
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
  const daysToDoubleLayout = genericLayout('Days to double');
  const positiveData = JSON.stringify([{ x, y: posY, type: 'scatter', mode: 'lines', name: 'IL' }]);
  const deathsData = JSON.stringify([{ x, y: deathsY, type: 'scatter', mode: 'lines', name: 'IL' }]);
  const additionalPositiveData = JSON.stringify([{ x, y: addPosY, type: 'scatter', mode: 'lines', name: 'IL' }]);
  const additionalDeathsData = JSON.stringify([{ x, y: addDeathsY, type: 'scatter', mode: 'lines', name: 'IL' }]);
  const percentPositiveData = JSON.stringify([{ x, y: percentPosY, type: 'scatter', mode: 'lines', name: 'IL' }]);
  const percentDeathsData = JSON.stringify([{ x, y: percentDeathsY, type: 'scatter', mode: 'lines', name: 'IL' }]);
  const percentTestedData = JSON.stringify([{ x, y: percentTestedY, type: 'scatter', mode: 'lines', name: 'IL' }]);
  const daysToDoubleData = JSON.stringify([{ x, y: daysToDouble(posY), type: 'scatter', mode: 'lines', name: 'IL' }]);

  res.render('illinois', {
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
    daysToDoubleLayout,
    daysToDoubleData,
  });
}

module.exports = illinois;
