const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var mongoose = require('mongoose');

var { Employee } = require('../models/employee');

//require the Elasticsearch librray
var elasticsearch = require('elasticsearch');
// instantiate an Elasticsearch client
var client = new elasticsearch.Client({
   hosts: [ 'http://localhost:9200']
});

var array=[];

// client.indices.delete({
//     index: '_all'
// }, function(err, res) {

//     if (err) {
//         console.error(err.message);
//     } else {
//         console.log('Indexes have been deleted!');
//     }
// });

// client.indices.create({
//     index: 'sarthak'
// }, function(error, response, status) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log("created a new index", response);
//     }
// });


// => localhost:3000/employees/
router.get('/', (req, res) => {

    Employee.find((err, docs) => {
        if (!err) { 
        // console.log(resp);            
        res.send(docs); }
        else { 
        console.log('Error in Retriving Employees :' + JSON.stringify(err, undefined, 2)); 
    
    }
    });

});


router.get('/agg', (req, res) => {
    client.search({
        index: 'sarthak',
        type: 'employee',
        body: {
           query: {
               "match_all": {}
           },
            "aggs" : {
                "price_ranges" : {
                    "range" : {
                        "field" : "salary",
                        "ranges" : [
                            { "to" : 100000 },
                            { "from" : 100000, "to" : 200000 },
                            { "from" : 200000, "to" : 300000 },
                            { "from" : 300000, "to" : 400000 },
                            { "from" : 400000, "to" : 500000 },
                            { "from" : 500000, "to" : 600000 },
                            { "from" : 600000, "to" : 700000 },
                            { "from" : 700000, "to" : 800000 },
                            { "from" : 800000, "to" : 900000 },
                            { "from" : 900000 }
                        ]
                    },
                    "aggs" : {
                        "result" : { "sum" : { "field" : "salary" } }
                    }
                }
            }
        
        }
        
      }).then(function(resp) {
        res.send(resp);
    }, function(err) {
        console.trace(err.message);
    });
});


router.get('/:term', (req, res) => {
    client.search({
        index: 'sarthak',
        type: 'employee',
    body: {
      'query': {
        'match_phrase_prefix': {
          name: req.params.term
        }
      }
    }
    }).then(function(resp) {
        res.send(resp);
    }, function(err) {
        console.trace(err.message);
    });
});

router.get('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Employee.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving Employee :' + JSON.stringify(err, undefined, 2)); }
    });

    
});

router.post('/', (req, res) => {

//    for (var i=0 ; i<5 ; i++){
    var emp = new Employee({
        name: req.body.name,
        position: req.body.position,
        office: req.body.office,
        salary: req.body.salary,
    });
//     array.push(emp);
// }
    // array.forEach(function (doc) {
        mongoose.models.Employee.db.collection('employees').insertOne(emp, (err, doc ) => {
                if (!err) { 
                    // console.log(`array = ${array}`);
                    res.send(doc); 
                    
                }
        
                else { console.log('Error in Employee Save :' + JSON.stringify(err, undefined, 2)); }
            });
        // });

    client.index({
        index: 'sarthak',
        id: req.params.id ,
        type: 'employee',
        body: {
            name: req.body.name,
            position: req.body.position,
            office: req.body.office,
            salary: req.body.salary,
        }
    }, function(err, resp, status) {
        // console.log(i);
        if(err){
        console.log('Error in Elastic Insert ' + err);
    }
    });
    

});


router.put('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var emp = {
        name: req.body.name,
        position: req.body.position,
        office: req.body.office,
        salary: req.body.salary,
    };
    Employee.findByIdAndUpdate(req.params.id, { $set: emp }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Employee Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.delete('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Employee Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});

module.exports = router;