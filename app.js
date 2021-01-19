const express = require('express');
const exphbs  = require('express-handlebars');
require('dotenv').config();

const dc = require('./routes/dc');
const illinois = require('./routes/illinois');
const maryland = require('./routes/maryland');
const states = require('./routes/states');
const unitedStates = require('./routes/united-states');

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/dc', dc);
app.get('/illinois', illinois);
app.get('/maryland', maryland);
app.get('/united-states', unitedStates);
app.get('/states', states);

app.listen(process.env.PORT);
