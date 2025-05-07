import express from 'express';
import * as url from 'url';
import fs from 'fs';
import * as db from './client/db.js'

const app = express();
const port = 8080;

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const resultsPath = `${__dirname}/client/results.json`;

app.use(express.static('client', { extensions: ['html, json'] }));

function uploadRace(req, res) {
  const results = req.body
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  res.json(results);
}

// figure out how to route properly lol
function handleAppUrls(req, res) {
    res.sendFile(`${__dirname}/client/index.html`);
}
app.get('/app/*subpages', handleAppUrls)

function bullkPostResults(req, res) {
  const results = db.bulkAddResults(req.body);
  res.json(results);
}
async function getRace(req, res) {
  const result = await db.findMessage(req.params.id);
  if (result) {
    res.json(result);
  } else {
    res.status(404).send('No match for that ID.');
  }
}
app.put('/results', express.json(), uploadRace);
app.put('/results2', express.json(), getRace);
app.put('/results/bulk', express.json(), bullkPostResults);


app.listen(port);
console.log(`Listening on ${port}`);