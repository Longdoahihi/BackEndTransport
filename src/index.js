
const path = require('path')
const express = require('express');
const { engine } = require('express-handlebars');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
//config env
require('dotenv').config();
// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//_moduleAlias
require('module-alias/register')
const route = require('./routes')
// static store img
app.use(express.static(path.join(__dirname, 'public')));
//HTTP logger
app.use(morgan('combined'))
//template engine
app.engine('hbs', engine({
    extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
//config routes
route(app);
app.listen(8888);