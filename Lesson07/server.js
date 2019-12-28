const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(express.static('.'));
app.use(bodyParser.json());

app.get('/catalog', (req, res) => {
  fs.readFile('data/catalog.json', 'utf-8', (err, data) => {
    if (err) res.sendStatus(404);
    res.send(data);
  })
});

app.post('/cart', (req, res) => {
  const item = req.body;
  fs.readFile('data/cart.json', 'utf-8', (err, data) => {
    if (err) res.sendStatus(500);
    const cart = JSON.parse(data);
    cart.push(item);
    fs.writeFile('data/cart.json', JSON.stringify(cart), (err) => {
      if (err) res.sendStatus(500);
      res.sendStatus(200);
    })
  });
});

// Get-запрос на получение информации о корзине
app.get('/cart', (req, res) => {
  fs.readFile('cart.json', 'utf-8', (err, data) => {
      res.send(data);
  });
});

//Создаём пост запрос на получение информации в корзину
app.post('/addToCard', (req, res) => {
  fs.readFile('data/cart.json', 'utf-8', (err, data) => {
      if(err) {
          res.send('{"result": 0}');
      }
      const cart = JSON.parse(data);
      const item = req.body;
      cart.push(item);
      fs.writeFile('data/cart.json', JSON.stringify(cart), (err) => {
          if(err) {
              res.send('{"result": 0}');
          } else {
              res.send('{"result": 1}');
          }
          // console.log('Скрипт выполнен: товар добавлен в массив');
      });
  });
});

// Post-запрос на получение информации о корзине
app.post('/updateCart', (req, res) => {
  fs.readFile('cart.json', 'utf-8', (err, data) => {
      if(err) {
          res.send('{"result": 0}');
      }
      const cart = req.body;
      fs.writeFile('cart.json', JSON.stringify(cart), (err) => {
          if(err) {
              res.send('{"result": 0}');
          } else {
              res.send('{"result": 1}');
          }
          // console.log('Скрипт выполнен: товар добавлен в массив');
      });
  });
});

app.listen(3000, () => {
  console.log('Server is running on port ${PORT}');
});
