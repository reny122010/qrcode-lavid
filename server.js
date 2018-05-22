var qr = require('qr-image');
var express = require('express');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var bodyParser = require('body-parser');
var app = express();

var urlMongo = "mongodb://localhost:27017/lavid";
app.use(bodyParser.urlencoded({extended: true}));

var Aluno = {};


app.get('/id/', function (req, res) {
    var id = req.query.id;
    console.log(id);
    var o_id = new mongo.ObjectID(id);
    MongoClient.connect(urlMongo, function (err, db) {
        if (err) {
            console.log(err);
        }
        db.collection('aluno').findOne({_id : o_id}, function (err, result) {
            if (err) throw err;
            Aluno = result;
            db.close();
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result));
        });
    });
});

app.get('/', function (req, res) {
    MongoClient.connect(urlMongo, function (err, db) {
        if (err) {
            console.log(err);
        }

        db.collection('aluno').count(
            function (err, res) {
                var r = Math.floor(Math.random() * parseInt(res));
                console.log(res);
                console.log(r);

                db.collection("aluno").find().limit(1).skip(r).toArray(function(err, result) {
                    if (err) throw err;
                    console.log(result[0]);
                    Aluno = result[0];
                    db.close();
                });
            }
        );



    });
    res.sendFile('/teamplate/index.html', {root: __dirname});
});

app.get('/', function (req, res) {
    MongoClient.connect(urlMongo, function (err, db) {
        if (err) {
            console.log(err);
        }
        db.collection('aluno').findOne({}, function (err, result) {
            if (err) throw err;
            Aluno = result;
            db.close();
        });
    });
    res.sendFile('/teamplate/index.html', {root: __dirname});
});

app.get('/qr/1', function (req, res) {
    try {
        var code = qr.image(JSON.stringify(Aluno), {type: 'png', size: 40});
        res.setHeader('Content-type', 'image/png');  //sent qr image to client side
        res.type('png');
        code.pipe(res);
    }
    catch (er) {
        console.log('teste');
    }
});

app.get('/qr/2', function (req, res) {
    try {
        var code = qr.image(JSON.stringify(Aluno._id), {type: 'png', size: 10});
        res.setHeader('Content-type', 'image/png');  //sent qr image to client side
        res.type('png');
        code.pipe(res);
    }
    catch (er) {
        console.log('teste');
    }
});

app.listen(80);
