require('dotenv').config();

const express = require('express');
const { Client } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

const db = new Client({
  user: process.env.PSQL_USER,
  host: 'localhost',
  database: process.env.PSQL_DB,
  password: process.env.PSQL_PASS,
  port: 5432,
});

db.connect((e) => {
  if (e) {
    console.log(e);
  } else {
    console.log(`Connected to PSQL DB: ${process.env.PSQL_DB}`);
  }
});

app.get('/', (req, res) => {
  const query = 'SELECT aerio.styles.*, json_object_agg(size, quantity) AS skus FROM aerio.styles JOIN aerio.skus ON aerio.styles.product_id = aerio.skus.product_id WHERE aerio.styles.product_id = 1 GROUP BY aerio.styles.id;';
  db.query(query)
  .then((data) => {
    res.send(data.rows);
  });
});

app.get('/products/', (req, res) => {
  const query = `SELECT * from aerio.overview LIMIT 5;`;
  db.query(query)
    .then((data) => {
      res.send(data.rows);
    });
});

app.get('/products/:product_id', (req, res) => {
  const join = `SELECT product_id, json_object_agg(feature, value) AS features FROM aerio.features WHERE product_id = 71699 GROUP BY product_id`;
  const query = `SELECT aerio.overview.*, features_agg.features FROM aerio.overview JOIN (${join}) AS features_agg ON aerio.overview.product_id = features_agg.product_id`;
  db.query(query)
    .then((data) => {
      res.send(data.rows);
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//mysql optimization ch8
//summary of each idea
//views "caching"
//get rid of cnosole logs w morgan when stress testing

//express middleware morgan for console logging
