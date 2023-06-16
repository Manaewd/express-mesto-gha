const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6489d872217a49430491d568', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.get('*', (req, res) => {
  res.status(404).send({ message: 'Not found' });
});

app.use(router);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Слушаю порт 3000');
});
