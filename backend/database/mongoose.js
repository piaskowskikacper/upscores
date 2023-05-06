const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://m001-student:Ip5IFT3atKrlQ3tu@sandbox.7vudx.mongodb.net/upscores?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("Connected to database"))
    .catch((error) => console.log(error));

module.exports = mongoose;