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



app.get('/frequencia', function (req, res) {
    //Mostra organizado    
    connection.query('select rota, count(rota) as frequencia from requisicao group by rota order by frequencia desc;',
        function (error, results, fields) {
            if (error)
                res.json;
            else {
                res.send(results)
            }

        })
});

var myLogger = function (req, res, next) {
    console.log("executou log")
    // Bota no banco
    var rota = req.url;
    var ip = req.socket.remoteAddress;
    var usrAg = req.get('User-Agent');
    var dt = new Date;

    connection.query(`insert into requisicao(rota, ip, user_agent, dt_hr) values('${rota}', '${ip}', '${usrAg}', '${dt}')`)

    var wat = ["Nossos fracassos, às vezes, são mais frutíferos do que os êxitos.",
        "Tente de novo. Fracasse de novo. Mas fracasse melhor",
        "É costume de um tolo, quando erra, queixar-se dos outros. É costume de um sábio queixar-se de si mesmo",
        "O verdadeiro heroísmo consiste em persistir por mais um momento, quando tudo parece perdido",
        "Na prosperidade, nossos amigos nos conhecem; na adversidade, nós é que conhecemos nossos amigos",
        "Nada acontece a menos que sonhemos antes",
    ]
    res.send(wat[Math.floor(Math.random() * 10 + 1)])
}



app.use("/*", myLogger);

app.listen(80, function () {
    console.log('Server escutou\n')
});