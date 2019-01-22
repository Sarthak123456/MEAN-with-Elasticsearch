const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/CrudDB', (err, db) => {
    if (!err)
        console.log('MongoDB connection succeeded.' +   db.name);
        // db.collection('employees').deleteMany({}));
    else
        console.log('Error in DB connection : ' + JSON.stringify(err, undefined, 2));
});

module.exports = mongoose;