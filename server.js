import express from 'express';
import * as url from 'url';
import fs from 'fs';
import * as db from './client/db.js'

const app = express();
const port = 8080;

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const resultsPath = `${__dirname}/client/results.json`;

app.use(express.static('client', { extensions: ['html, json'] }));

app.get('/races', express.json(), async (req, res) => {
  try {
    res.json(await db.getAllRaces());
  }
  catch {
    console.log(`error fetching races: ${error}`);
  }
});
/*
app.get('/setup-race', (req, res) => {
  res.sendFile(`${__dirname}/client/setup-race.html`);
});
app.get('/88', async (req, res) => {res.send(await db.findRace('88'))});
app.get('/record-race', (req, res) => {
  res.sendFile(`${__dirname}/client/record-race.html`);
});
app.get('/:raceid/start-race', (req, res) => {
  res.sendFile(`${__dirname}/client/start-race.html`);
});
app.post('/create-race', express.json(), (req, res) => {
  try {
    db.createRace(req.body);
    res.status(200).send({'message': 'succes'});
  }
  catch (error) {
    res.status(500).send(error);
  }
});*/

app.listen(port);
console.log(`Listening on ${port}`);