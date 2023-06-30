require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');
// eslint-disable-next-line import/no-extraneous-dependencies
const { errors } = require('celebrate');
const routes = require('./routes');
const errorHandler = require('./errors/error-handler');

const app = express();
const { PORT = 3000 } = process.env;

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json()); // входящие запросы переводит в JSON
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use(cookieParser()); // подключаем парсер cookie (для извлечения данных из куков)

app.use(routes);
app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Ок');
});
