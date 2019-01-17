const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

//require the Elasticsearch librray
var elasticsearch = require('elasticsearch');
// instantiate an Elasticsearch client
var client = new elasticsearch.Client({
   hosts: [ 'http://localhost:9200']
});

const { mongoose } = require('./db.js');
var employeeController = require('./controllers/employeeController.js');

var app = express();
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:4200' }));

app.listen(3000, () => console.log('Server started at port : 3000'));

client.ping({
    requestTimeout: 30000,
}, function(error) {
    if (error) {
        console.error('elasticsearch cluster is down!');
    } else {
        console.log('Everything is ok with ElasticSearch');
    }
});


app.use('/employees', employeeController);