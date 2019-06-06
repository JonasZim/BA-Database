const express = require('express');
const router = express.Router();
const mongoDB = require('../database/mongoDB/operations');
const postgres = require('../database/postgres/operations');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/insert', function(req, res, next){
    mongoDB.insertDocuments('myproject', req.body.collection, req.body.entry);
    res.status(200).json({
    status: 'Doc inserted'
  })
});

router.post('/autoInsert', function(req, res, next){
    const entry = JSON.parse(req.body.attributes);
    entry.timestamp = new Date();
    console.log(req.body.db);
    switch (req.body.db) {
        case 'postgres':
            postgres.insertIntoTable(req.body.schemaName + 'Auto', entry);
            break;
        default:
            //mongoDB.insertDocuments('myproject', req.body.schemaName + 'Auto', entry);
    }
    res.status(200).json({
        status: 'Doc inserted'
    })
});

router.post('/create', function(req, res, next) {
  console.log(req.body);
  mongoDB.createCrapped('myproject', req.body.collection);
  res.status(200).send('Hallo');
});

router.post('/autoCreate', function(req, res, next) {
    console.log(req.body);
    if(req.body.attributes){
        const table = JSON.parse(req.body.attributes);
        console.log(table);
    }
    switch (req.body.db) {
        case 'postgres':
            postgres.createTable(req.body.schemaName + 'Auto');
            break;
        default:
            mongoDB.createCrapped('myproject', req.body.schemaName);
            mongoDB.createCrapped('myproject', req.body.schemaName + 'Auto');
    }
    res.status(200).send('Hallo');
});

router.post('/update', function(req, res, next){
  mongoDB.update('myproject', req.body.collection, req.body.entry, req.body.matcher);
  res.status(200).send('Fun')
});

router.post('/findOne', function(req, res, next){
  console.log(req.body);
  mongoDB.findEntry('myproject', req.body.collection, req.body.matcher, req.body.projection)
      .then((result) => {
        console.log(result);
        res.json(result[0]);
      })
});

router.post('/findAll', function(req,res,next){
    mongoDB.findEntry('myproject', req.body.collection, req.body.matcher, req.body.projection)
        .then((result) => {
            console.log(result);
            res.json(result);
        })
});


module.exports = router;
