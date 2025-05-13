import express from 'express';
import * as url from 'url';
import fs from 'fs';
import * as db from './client/js/db.js'

const app = express();
const port = 8080;

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

app.use(express.static('client', { extensions: ['html', 'json'] }));


app.get('/', (req, res) => {res.sendFile(`${__dirname}/client/screens/index.html`)});
app.get('/stopwatch/:raceid', (req, res) => {res.sendFile(`${__dirname}/client/screens/stopwatch.html`)});
app.get('/finished-results/:raceid', (req, res) => {res.sendFile(`${__dirname}/client/screens/results.html`)})

app.get('/races', express.json(), async (req, res) => {
  try {
    res.json(await db.getAllRaces());
  }
  catch (error) {
    console.log(`error fetching races: ${error}`);
  }
});
app.get('/:raceid/checkpoint/:number', (req, res) => {
  res.sendFile(`${__dirname}/client/html/checkpoint.html`);
});
app.get('/:raceid/view-race', (req, res) => {
  res.sendFile(`${__dirname}/client/html/view-race.html`);
});
app.get('/:raceid/view-results', (req, res) => {
  res.sendFile(`${__dirname}/client/html/view-results.html`);
});
app.get('/:raceid/live', (req, res) => {
  res.sendFile(`${__dirname}/client/html/live.html`);
});
app.get('/:raceid/results', async (req, res) => {
  const raceid = req.params.raceid;
  res.send(await db.getRunners(raceid))}); 
app.get('/:raceid/results-live', async (req, res) => {
  const raceid = req.params.raceid;
  res.send(await db.getLastRunner(raceid))}); 
app.get('/race/:raceid', async (req, res) => {
  const raceid = req.params.raceid;
  res.send(await db.findRace(raceid))}); 



async function uploadRace(req, res) {
  try {
    await db.addAllRunners(req.body, req.params.raceid);
    res.status(200).send({'message': 'all runners sent to the database'});
  }
  catch (error) {
    console.log(error);
  }
}
function createDbRace(req, res) {
  try {
    db.createRace(req.body);
    res.status(200).send({'message': 'race created and uploaded to database successfully'});
  }
  catch (error) {
    res.status(500).send(error);
  }
}
function finishRace(req, res) {
  try {
    db.finishRace(req.params.raceid);
    res.status(200).send({'message': 'race created and uploaded to database successfully'});
  }
  catch (error) {
    res.status(500).send(error);
  }
}
async function getRunners(req, res) {
   try {
    res.send(await db.getRunners(req.params.raceid));
   }
  catch (error) {
    res.status(500).send(error);
  }
}

app.get('/results/finished/:raceid', express.json(), getRunners);
app.get('/finished/:raceid', express.json(), finishRace); // is this being a get request a good idea?
app.post('/results/:raceid', express.json(), uploadRace);
app.post('/race', express.json(), createDbRace);

app.listen(port);
console.log(`Listening on ${port}`);