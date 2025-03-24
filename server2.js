import fs from 'fs/promises';

const express = require('express')
const app = express()

async function loadPage() {
  await fs.readFile('index.html')
}

app.get('/', (req, res) => {loadPage()})

//app.length('/index.html', (req, res) => {})


app.use(express.static('public'));
app.listen(8080);