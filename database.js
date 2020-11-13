const { Client } = require("pg");
require("dotenv").config();

let client;
const connectToDB = async () => {
  client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
};
const disconnectFromDB = async () => await client.end();

const createStatesDataTableQuery = {
  text: `
    DROP TABLE IF EXISTS states;
    CREATE TABLE states (
      did                       integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
      name                      char(2),
      date                      timestamp,
      positive                  integer,
      deaths                    integer,
      tested                    integer,
      total_positive            integer,
      total_deaths              integer,
      total_tested              integer,
      hospitalized_currently    integer,
      in_icu_currently          integer
    );
  `,
};

async function createStatesDataTable() {
  await client.query(createStatesDataTableQuery);
}

const createCountryDataTableQuery = {
  text: `
    DROP TABLE IF EXISTS countries;
    CREATE TABLE countries (
      did                       integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
      name                      varchar(40),
      date                      timestamp,
      positive                  integer,
      deaths                    integer,
      tested                    integer,
      total_positive            integer,
      total_recovered           integer,
      total_deaths              integer,
      total_tested              integer,
      hospitalized_currently    integer,
      in_icu_currently          integer
    );
  `,
};

async function createCountriesDataTable() {
  await client.query(createCountryDataTableQuery);
}

const statesColumns = "name, date, positive, deaths, tested, total_positive, total_deaths, total_tested, hospitalized_currently, in_icu_currently";

const insertIntoStatesQuery = (values) => ({
  name: "insert-into-states",
  text: `
    INSERT INTO states (${statesColumns})
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
  `,
  values,
});

async function insertIntoStates(values) {
  await client.query(insertIntoStatesQuery(values));
}

const countriesColumns = "name, date, positive, deaths, tested, total_positive, total_recovered, total_deaths, total_tested, hospitalized_currently, in_icu_currently";

const insertIntoCountriesQuery = (values) => ({
  name: "insert-into-countries",
  text: `
    INSERT INTO countries (${countriesColumns})
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
  `,
  values,
});

async function insertIntoCountries(values) {
  await client.query(insertIntoCountriesQuery(values));
}

const selectAllStatesDataQuery = {
  name: "select-all-states-data",
  text: `
    SELECT
      statesData.date,
      statesData.name,
      statesData.positive,
      statesData.deaths,
      statesData.tested,
      statesData.total_positive,
      statesData.total_deaths,
      statesData.total_tested,
      statesData.hospitalized_currently,
      statesData.in_icu_currently,
      AVG(statesData.positive)
        OVER(PARTITION BY name ORDER BY statesData.date ROWS BETWEEN 7 PRECEDING AND CURRENT ROW) as "avgPositive",
      AVG(statesData.deaths)
        OVER(PARTITION BY name ORDER BY statesData.date ROWS BETWEEN 7 PRECEDING AND CURRENT ROW) as "avgDeath",
      AVG(statesData.percentPositive)
        OVER(PARTITION BY name ORDER BY statesData.date ROWS BETWEEN 7 PRECEDING AND CURRENT ROW) as "avgPercentPositive",
      AVG(statesData.percentDeaths)
        OVER(PARTITION BY name ORDER BY statesData.date ROWS BETWEEN 7 PRECEDING AND CURRENT ROW) as "avgPercentDeaths"
    FROM (
      SELECT
        x.date,
        d.name,
        d.positive,
        d.deaths,
        d.tested,
        d.total_positive,
        d.total_deaths,
        d.total_tested,
        d.hospitalized_currently,
        d.in_icu_currently,
        d.percentPositive,
        d.percentDeaths
      FROM (
        SELECT generate_series(min(date), max(date), '1d')::DATE AS date
        FROM states
      ) x
      LEFT JOIN (
        SELECT
          name,
          DATE_TRUNC('day', date)::DATE AS date,
          positive,
          deaths,
          tested,
          total_positive,
          total_deaths,
          total_tested,
          hospitalized_currently,
          in_icu_currently,
          CASE WHEN tested = 0 THEN 0
              ELSE (positive::FLOAT / tested::FLOAT)
          END AS percentPositive,
          CASE WHEN positive = 0 THEN 0
              ELSE (deaths::FLOAT / positive::FLOAT)
          END AS percentDeaths
        FROM
          states
        ORDER BY
          name, date ASC
      ) d USING (date)
      GROUP BY
        x.date,
        d.name,
        d.positive,
        d.deaths,
        d.tested,
        d.total_positive,
        d.total_deaths,
        d.total_tested,
        d.hospitalized_currently,
        d.in_icu_currently,
        d.percentPositive,
        d.percentDeaths
      ORDER BY
        x.date ASC
    ) AS statesData;
  `,
};

async function selectAllStatesData() {
  const data = await client.query(selectAllStatesDataQuery);
  return data.rows;
}

const selectAllCountriesDataQuery = {
  name: "select-all-countries-data",
  text: `
    SELECT
      countriesData.date,
      countriesData.name,
      countriesData.positive,
      countriesData.deaths,
      countriesData.tested,
      countriesData.total_positive,
      countriesData.total_recovered,
      countriesData.total_deaths,
      countriesData.total_tested,
      countriesData.hospitalized_currently,
      countriesData.in_icu_currently,
      AVG(countriesData.positive)
        OVER(PARTITION BY name ORDER BY countriesData.date ROWS BETWEEN 7 PRECEDING AND CURRENT ROW) as "avgPositive",
      AVG(countriesData.deaths)
        OVER(PARTITION BY name ORDER BY countriesData.date ROWS BETWEEN 7 PRECEDING AND CURRENT ROW) as "avgDeaths",
      AVG(countriesData.percentPositive)
        OVER(PARTITION BY name ORDER BY countriesData.date ROWS BETWEEN 7 PRECEDING AND CURRENT ROW) as "avgPercentPositive",
      AVG(countriesData.percentDeaths)
        OVER(PARTITION BY name ORDER BY countriesData.date ROWS BETWEEN 7 PRECEDING AND CURRENT ROW) as "avgPercentDeaths"
    FROM (
      SELECT
        x.date,
        d.name,
        d.positive,
        d.deaths,
        d.tested,
        d.total_positive,
        d.total_recovered,
        d.total_deaths,
        d.total_tested,
        d.percentPositive,
        d.percentDeaths,
        d.hospitalized_currently,
        d.in_icu_currently
      FROM (
        SELECT generate_series(min(date), max(date), '1d')::DATE AS date
        FROM countries
      ) x
      LEFT JOIN (
        SELECT
          DATE_TRUNC('day', date)::DATE AS date,
          name,
          positive,
          deaths,
          tested,
          total_positive,
          total_recovered,
          total_deaths,
          total_tested,
          hospitalized_currently,
          in_icu_currently,
          CASE WHEN tested = 0 THEN 0
              ELSE (positive::FLOAT / tested::FLOAT)
          END AS percentPositive,
          CASE WHEN positive = 0 THEN 0
              ELSE (deaths::FLOAT / positive::FLOAT)
          END AS percentDeaths
        FROM
          countries
        ORDER BY
          name, date ASC
      ) d USING (date)
      GROUP BY
        x.date,
        d.name,
        d.positive,
        d.deaths,
        d.tested,
        d.total_positive,
        d.total_recovered,
        d.total_deaths,
        d.total_tested,
        d.percentPositive,
        d.percentDeaths,
        d.hospitalized_currently,
        d.in_icu_currently
      ORDER BY
        x.date ASC
    ) AS countriesData;
  `,
};

async function selectAllCountriesData() {
  const data = await client.query(selectAllCountriesDataQuery);
  return data.rows;
}

module.exports = {
  connectToDB,
  disconnectFromDB,
  createStatesDataTable,
  insertIntoStates,
  createCountriesDataTable,
  insertIntoCountries,
  selectAllStatesData,
  selectAllCountriesData,
};
