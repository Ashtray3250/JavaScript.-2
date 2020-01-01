// модуль для работы с http запросами
const express = require('express');


// модуль для работы с файловой системой
const fs = require('fs');

const app = express();  // модуль фреймворк для работы с сервером

// cartRouter.js  роутер корзины
const cart = require('./cartRouter');


app.use(express.json());
// задаем пользовательский путь по умолчанию ('/'), который будет обращаться к папке public (статические файлы)
// что видит юзер привязано к public
app.use('/', express.static('public'));
app.use('/api/cart', cart); // привязываем путь к корзине

// поиск
app.get('/api/products', (request, response) => {
    // имитация запроса к базе данных -- обращение к файлу JSON (хотя в реальности бд все равно отдаст JSON
    fs.readFile('server/db/products.json','utf-8', (error, data) => {
       if (error) {
           // имитация ответа на запроса к БД -- файл JSON с {"result" : 0}
           response.sendStatus(404, JSON.stringify({result: 0, text: error}));
       }
       else {
           response.send(data);
       }
    });
});


// http://localhost:3000/
app.listen( 3000 , () => {
    console .log( 'server is running on port 3000!' );
});
