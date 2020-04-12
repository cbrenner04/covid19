const express = require('express');
const exphbs  = require('express-handlebars');
require('dotenv').config();

const illinois = require('./routes/illinois');
const states = require('./routes/states');
const countries = require('./routes/countries');
const unitedStates = require('./routes/united-states');

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/illinois', illinois);
app.get('/united-states', unitedStates);
app.get('/states', states);
app.get('/countries', countries);

app.listen(3000);
