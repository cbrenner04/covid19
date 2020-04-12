const { showData } = require('../show-data');

function daysToDouble(positiveCounts) {
  const doubleCounts = [];
  positiveCounts.map((pos, index) => {
    const doubledIndex = positiveCounts.findIndex(d => (d >= pos * 2));
    if (doubledIndex >= 0) {
      const count = doubledIndex - index;
      if (count >= 0 ) doubleCounts.push(count);
    }
  });
  return doubleCounts;
}

async function states(req, res) {
  const { statesData } = await showData();
  // using illinois just to get dates
  const illinoisData = statesData.filter((datum) => datum.name === 'IL');
  const x  = illinoisData.map((datum) => datum.date);
  let positiveData = [];
  let deathsData = [];
  let additionalPositiveData = [];
  let additionalDeathsData = [];
  let percentPositiveData = [];
  let percentDeathsData = [];
  let percentTestedData = [];
  statesData.forEach((datum) => {
    const { name, positive, deaths, addedPositive, addedDeaths, percentPositive, percentDead, percentTested } = datum;
    const positiveI = positiveData.findIndex(d => d.name === name);
    if (positiveI < 0) {
      positiveData.push({ x, y: [positive], type: 'scatter', mode: 'lines', name })
    } else {
      positiveData[positiveI].y.push(positive);
    }
    const deathsI = deathsData.findIndex(d => d.name === name);
    if (deathsI < 0) {
      deathsData.push({ x, y: [deaths], type: 'scatter', mode: 'lines', name })
    } else {
      deathsData[deathsI].y.push(deaths);
    }
    const additionalPositiveI = additionalPositiveData.findIndex(d => d.name === name);
    if (additionalPositiveI < 0) {
      additionalPositiveData.push({ x, y: [addedPositive], type: 'scatter', mode: 'lines', name })
    } else {
      additionalPositiveData[additionalPositiveI].y.push(addedPositive);
    }
    const additionalDeathsI = additionalDeathsData.findIndex(d => d.name === name);
    if (additionalDeathsI < 0) {
      additionalDeathsData.push({ x, y: [addedDeaths], type: 'scatter', mode: 'lines', name })
    } else {
      additionalDeathsData[additionalDeathsI].y.push(addedDeaths);
    }
    const percentPositiveI = percentPositiveData.findIndex(d => d.name === name);
    if (percentPositiveI < 0) {
      percentPositiveData.push({ x, y: [percentPositive], type: 'scatter', mode: 'lines', name })
    } else {
      percentPositiveData[percentPositiveI].y.push(percentPositive);
    }
    const percentDeathsI = percentDeathsData.findIndex(d => d.name === name);
    if (percentDeathsI < 0) {
      percentDeathsData.push({ x, y: [percentDead], type: 'scatter', mode: 'lines', name })
    } else {
      percentDeathsData[percentDeathsI].y.push(percentDead);
    }
    const percentTestedI = percentTestedData.findIndex(d => d.name === name);
    if (percentTestedI < 0) {
      percentTestedData.push({ x, y: [percentTested], type: 'scatter', mode: 'lines', name })
    } else {
      percentTestedData[percentTestedI].y.push(percentTested);
    }
  });

  const daysToDoubleData = JSON.stringify(positiveData.map((posCounts) => {
    const { x, y, type, mode, name } = posCounts;
    const doubleTime = daysToDouble(y);
    return { x, y: doubleTime, type, mode, name };
  }));

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
  positiveData = JSON.stringify(positiveData);
  deathsData = JSON.stringify(deathsData);
  additionalPositiveData = JSON.stringify(additionalPositiveData);
  additionalDeathsData = JSON.stringify(additionalDeathsData);
  percentPositiveData = JSON.stringify(percentPositiveData);
  percentDeathsData = JSON.stringify(percentDeathsData);
  percentTestedData = JSON.stringify(percentTestedData);

  res.render('states', {
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
    daysToDoubleData,
    daysToDoubleLayout,
  });
}

module.exports = states;
