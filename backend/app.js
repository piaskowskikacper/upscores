const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const mongoose = require('./database/mongoose');

const { spawn } = require('child_process');

const Match = require('./database/models/match');
const User = require('./database/models/user')

app.use(express.json());

app.listen(3000, () => console.log("Server connected on port 3000"));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-COntrol-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});


function verifyToken(req,res,next){
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request')
    } 
    let token = req.headers.authorization.split(' ')[1]
    if (token === 'null') {
        return res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token, 'secretKey') 
    if(!payload) {
        return res.status(401).send('Unauthorized request')
    }   
    // console.log(payload.subject)
    req.userId = payload.subject
    next()
}

app.get('/matches', (req, res) => {
    today = new Date().toISOString().split('T')[0]
    Match.find({date: today},
                {_id:1, time:1, league:1, home_team:1, away_team:1, home_goals:1, away_goals:1})
        .then(matches => res.send(matches))
        .catch((error) => console.log(error))
});

app.get('/matches/live', (req, res) => {
    today = new Date().toISOString().split('T')[0]
    Match.find({date: today, $or: [ { time: { $regex : /\d'/ } }, { time: { $regex : /\d\d'/ } }, { time: "HT" }, { time: { $regex : /[0-9]+\+[0-9]+'/ } } ]}, 
                {_id:1, time:1, league:1, home_team:1, away_team:1, home_goals:1, away_goals:1})
        .then(matches => res.send(matches))
        .catch((error) => console.log(error))
});

app.get('/matches/finished', (req, res) => {
    today = new Date().toISOString().split('T')[0]
    Match.find({date: today, time: "FT"},
                {_id:1, time:1, league:1, home_team:1, away_team:1, home_goals:1, away_goals:1})
        .then(matches => res.send(matches))
        .catch((error) => console.log(error))
});

app.get('/matches/coming', (req, res) => {
    today = new Date().toISOString().split('T')[0]
    Match.find({date: today, time: {$regex: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/}},
                {_id:1, time:1, league:1, home_team:1, away_team:1, home_goals:1, away_goals:1})
        .then(matches => res.send(matches))
        .catch((error) => console.log(error))
});

app.get('/matches/favourite', 
verifyToken, 
(req, res) => {

    let token = req.headers.authorization.split(' ')[1]
    let decoded = jwt.verify(token, 'secretKey') 
    var userId = decoded.subject;
    // console.log(userId)

    User.findOne({_id: userId}, {_id: 0, favourite:1})
        .then(matches => {
            Match.find({ _id: matches.favourite })
                .then(result => res.send(result))
            })

            // console.log(matches)
            // res.send(matches),

        .catch((error) => console.log(error))
    })


app.get('/matches/:_id', (req, res) => {
    Match.find({ _id: req.params._id })
        .then(matches => res.send(matches))
        .catch((error) => console.log(error))
});

app.get('/matches/date/:date', (req, res) => {
    Match.find({ date: req.params.date },
                {_id:1, time:1, league:1, home_team:1, away_team:1, home_goals:1, away_goals:1})
        .then(matches => res.send(matches))
        .catch((error) => console.log(error))
});

app.get('/matches/:league/table', (req, res) => {
    Match.find({ league: req.params.league })
        .then(matches => res.send(matches))
        .catch((error) => console.log(error))
});


app.post("/register", (req, res) => {
    var user = new User(req.body);
    User.findOne({username: user.username})
        .then(userData => {
            if (!userData) {
                if (user.username.indexOf(' ') == -1 && user.password.indexOf(' ') == -1 
                // && user.password.indexOf('') == -1
                ){
                    user.save()
                    .then(registeredUser => {
                        let payload = { subject: registeredUser._id }
                        let token = jwt.sign(payload, 'secretKey')
                        res.status(200).send({token})
                    })   
                } else {
                    res.status(404).send('You can not put empty username or password!')
                }

            } else {
                res.status(404).send('Username already taken')
            }
        })
      .catch(err => {
        res.status(400).send(err);
      });
});


app.post('/login', (req,res)=> {
    var user = new User(req.body);
    User.findOne({username: user.username})
        .then( userData => {
            if (!userData) {
                res.status(404).send('This user does not exist')
            } else
                if (user.password !== userData.password) {
                    res.status(404).send('Invalid password')
                 } else {
                    let payload = { subject: userData._id }
                    let token = jwt.sign(payload, 'secretKey') 
                    res.status(200).send({token})
                 }
        })
        .catch((error) => console.log(error))
});


setInterval(function(){
    const childDbUpdate = spawn('py', ['scrapper.py']);

    childDbUpdate.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    
    childDbUpdate.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });
    
    childDbUpdate.on('close', (code) => {
        console.log(`database update exited with code ${code}`);
    });
}, 300000);