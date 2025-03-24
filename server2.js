const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('/index.html')
})

app.use(express.static('public'));
app.listen(8080);