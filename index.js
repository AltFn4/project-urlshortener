require('dotenv').config();
const express = require('express');
const url = require('node:url');
const dns = require('node:dns');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

const urlList = [];

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  var original_url = req.body.url;
  var uri = new url.URL(original_url);

  if (uri.hostname == null) {
    res.json({ error: 'invalid url' });
  }

  dns.lookup(uri.hostname, async (err, address, family) => {
    if (err) {
      res.json({ error: 'invalid url' });
    } else {
      var short_url = urlList.length;
      urlList[short_url] = original_url;
      res.json({ original_url: original_url, short_url: short_url });
    }
  });
});

app.get('/api/shorturl/:short_url', function(req, res) {
  var short_url = req.params.short_url;
  var uri = urlList[short_url];
  res.redirect(uri);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
