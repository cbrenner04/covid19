const _ = require('lodash');

const { showData } = require('../show-data');

async function countries(req, res) {
  const { countriesData } = await showData();
  // using us just to get dates
  const usData = countriesData.filter((datum) => datum.name === 'US');
  const x  = usData.map((datum) => datum.date);
  let positiveData = [];
  let deathsData = [];
  let additionalPositiveData = [];
  let additionalDeathsData = [];
  let percentPositiveData = [];
  let percentDeathsData = [];
  let percentTestedData = [];
  let recoveredData = [];
  let percentRecoveredData = [];
  countriesData.forEach((datum) => {
    const { name, positive, deaths, addedPositive, addedDeaths, percentPositive, percentDead, percentTested, recovered, percentRecovered } = datum;
    const positiveI = _.findIndex(positiveData, d => d.name === name);
    if (positiveI < 0) {
      positiveData.push({ x, y: [positive], type: 'scatter', mode: 'lines', name })
    } else {
      positiveData[positiveI].y.push(positive);
    }
    const deathsI = _.findIndex(deathsData, d => d.name === name);
    if (deathsI < 0) {
      deathsData.push({ x, y: [deaths], type: 'scatter', mode: 'lines', name })
    } else {
      deathsData[deathsI].y.push(deaths);
    }
    const additionalPositiveI = _.findIndex(additionalPositiveData, d => d.name === name);
    if (additionalPositiveI < 0) {
      additionalPositiveData.push({ x, y: [addedPositive], type: 'scatter', mode: 'lines', name })
    } else {
      additionalPositiveData[additionalPositiveI].y.push(addedPositive);
    }
    const additionalDeathsI = _.findIndex(additionalDeathsData, d => d.name === name);
    if (additionalDeathsI < 0) {
      additionalDeathsData.push({ x, y: [addedDeaths], type: 'scatter', mode: 'lines', name })
    } else {
      additionalDeathsData[additionalDeathsI].y.push(addedDeaths);
    }
    const percentPositiveI = _.findIndex(percentPositiveData, d => d.name === name);
    if (percentPositiveI < 0) {
      percentPositiveData.push({ x, y: [percentPositive], type: 'scatter', mode: 'lines', name })
    } else {
      percentPositiveData[percentPositiveI].y.push(percentPositive);
    }
    const percentDeathsI = _.findIndex(percentDeathsData, d => d.name === name);
    if (percentDeathsI < 0) {
      percentDeathsData.push({ x, y: [percentDead], type: 'scatter', mode: 'lines', name })
    } else {
      percentDeathsData[percentDeathsI].y.push(percentDead);
    }
    const percentTestedI = _.findIndex(percentTestedData, d => d.name === name);
    if (percentTestedI < 0) {
      percentTestedData.push({ x, y: [percentTested], type: 'scatter', mode: 'lines', name })
    } else {
      percentTestedData[percentTestedI].y.push(percentTested);
    }
    const recoveredI = _.findIndex(recoveredData, d => d.name === name);
    if (recoveredI < 0) {
      recoveredData.push({ x, y: [recovered], type: 'scatter', mode: 'lines', name })
    } else {
      recoveredData[recoveredI].y.push(recovered);
    }
    const percentRecoveredI = _.findIndex(percentRecoveredData, d => d.name === name);
    if (percentRecoveredI < 0) {
      percentRecoveredData.push({ x, y: [percentRecovered], type: 'scatter', mode: 'lines', name })
    } else {
      percentRecoveredData[percentRecoveredI].y.push(percentRecovered);
    }
  });

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
  positiveData = JSON.stringify(positiveData);
  deathsData = JSON.stringify(deathsData);
  additionalPositiveData = JSON.stringify(additionalPositiveData);
  additionalDeathsData = JSON.stringify(additionalDeathsData);
  percentPositiveData = JSON.stringify(percentPositiveData);
  percentDeathsData = JSON.stringify(percentDeathsData);
  percentTestedData = JSON.stringify(percentTestedData);
  recoveredData = JSON.stringify(recoveredData);
  percentRecoveredData = JSON.stringify(percentRecoveredData);

  res.render('countries', {
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

module.exports = countries;
