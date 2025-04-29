import express from 'express';
import * as url from 'url';
import fs from 'fs';

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

app.get('/');
app.put('/results', express.json(), uploadRace);

app.listen(port);
console.log(`Listening on ${port}`);