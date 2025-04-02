import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const app = express();
const port = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const resultsPath = path.join(__dirname, '/results');

//app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static('app'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
  });
app.post('/results', resultsPath);

app.listen(port)