function numericalDisplay(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function genericLayout(title) {
  return JSON.stringify({
    title,
    xaxis: {
      title: "Date",
    },
    yaxis: {
      title,
    },
    showlegend: false,
  });
}

module.exports = {
  genericLayout,
  numericalDisplay,
}
