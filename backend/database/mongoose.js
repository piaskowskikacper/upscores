const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('xxxmongodbdburihere', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("Connected to database"))
    .catch((error) => console.log(error));

module.exports = mongoose;
