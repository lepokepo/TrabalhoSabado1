const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const moment = require('moment');
const dayjs = require('dayjs')
const app = express();
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'logdb',
})

connection.connect(function (err) {
    if (err) {
        console.error('erro conectando banco: ' + err.stack())
        return;
    }

    console.log('Banco conectado')
})
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



//Rotas
app.get('/requisicao', function (req, res) {
    connection.query('select rota, count(rota) as frequencia from requisicao group by rota order by frequencia desc;',
        function (error, results, fields) {
            if (error)
                res.json;
            else {
                results.forEach(element => {

                });
                res.json(results)

            }

            console.log('executou /eventos')
        })
});

var myLogger = function (req, res, next) {

    app.post('/', function (req, res) {

        var rota = req.url;
        var ip = req.socket.remoteAddress;
        var usrAg = req.get('User-Agent');
        var dt = new Date;

        console.log(rota + ip + usrAg + dt)

        connection.query(`insert into requisicao(rota, ip, user-agent, dt_hr) values('${rota}', '${ip}', '${usrAg}', '${dt}')`, function (error, results, fields) {
            if (error)
                error.json;
            else
                res.json(results);
            console.log('executou poste');
        });
    });
    console.log('executou log');
    var wat = ["dale1", "dale2", "dale3", "dale4", "dale5", "dale6", "dale7", "dale8", "dale9", "feitoooooooo"]
    res.send(wat[Math.floor(Math.random() * 10 + 1)])
};

app.use("/", myLogger);

app.listen(80, function () {
    console.log('Server escutou\n')
});