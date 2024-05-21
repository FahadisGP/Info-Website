require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./server/config/db');

const app = express();

const port = 5000 || process.env.PORT;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

connectDB();  

app.use(express.static('public'));

app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/index'));

app.get('*', function(req, res) {
  res.status(404).send('404 Page Not Found.')
})


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});