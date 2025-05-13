import express from 'express';
import * as url from 'url';
import fs from 'fs';
import * as db from './client/db.js'

const app = express();
const port = 8080;

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const resultsPath = `${__dirname}/client/results.json`;

app.use(express.static('client', { extensions: ['html', 'json'] }));

app.get('/races', express.json(), async (req, res) => {
  try {
    res.json(await db.getAllRaces());
  }
  catch (error) {
    console.log(`error fetching races: ${error}`);
  }
});
app.get('/:raceid/view-race', (req, res) => {
  res.sendFile(`${__dirname}/client/view-race.html`);
});
app.get('/:raceid/view-results', (req, res) => {
  res.sendFile(`${__dirname}/client/view-results.html`);
});
app.get('/:raceid/live', (req, res) => {
  res.sendFile(`${__dirname}/client/live.html`);
});
app.get('/:raceid/results', async (req, res) => {
  const raceid = req.params.raceid;
  res.send(await db.getRunners(raceid))}); 
app.get('/:raceid/results-live', async (req, res) => {
  const raceid = req.params.raceid;
  res.send(await db.getLastRunner(raceid))}); 
app.post('/:raceid/upload/race', express.json(), async (req, res) => {
  try {
    await db.bulkAddResults(req.body);
    console.log('race saved yippie');
  }
  catch (error) {
    //res.sendStatus(500).send(`Failed to upload runner | saving to localstorage...| error: ${error}`);
    console.log(`Failed to upload runner | saving to localstorage...| ${error}`);
  }
})
app.post('/:raceid/upload/runner', express.json(), async (req, res) => {
  try {
    await db.addRunner(req.body);
    console.log('runner saved yippie');
  }
  catch (error) {
    //res.sendStatus(500).send(`Failed to upload runner | saving to localstorage...| error: ${error}`);
    console.log(`Failed to upload runner | saving to localstorage...| ${error}`);
  }
})
app.post('/:raceid/update/runner', express.json(), async (req, res) => {
  try {
    await db.updateRunner(req.body);
    console.log('runner id updated yippie');
  }
  catch (error) {
    console.log(`Failed to update runner | saving to localstorage...| ${error}`);
  }
})
app.post('/create-race', express.json(), (req, res) => {
  try {
    db.createRace(req.body);
    res.status(200).send({'message': 'succes'});
  }
  catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port);
console.log(`Listening on ${port}`);