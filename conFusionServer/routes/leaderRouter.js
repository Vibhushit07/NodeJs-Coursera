const express = require('express');
const bodyParser = require('body-parser');

const Leaders = require('../models/leaders');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get((req, res, next) => {
    Leaders.find({})
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);

    }, (err) => next(err))
    .catch(err => next(err));
})

.post((req, res, next) => {
    Leaders.create(req.body)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);

    }, (err) => next(err))
    .catch(err => next(err));
})

.put((req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation not supported on /leaders');
})

.delete((req, res, next) => {
    Leaders.remove({})
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
        
    }, (err) => next(err))
    .catch(err => next(err));
});

leaderRouter.route('/:leaderId')
.get((req, res, next) => {
    res.end('Will send details of the leader: ' + req.params.leaderId + ' to you!');
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('Post operation not supported on /leaders/' + req.params.leaderId);
})
.put((req, res, next) => {
    res.write('Updating the leader: ' + req.params.leaderId + '\n');
    res.end('Will update the leader: ' + req.body.name + ' with details: ' + req.body.description);
})
.delete((req, res, next) => {
    res.end('Deleting leader: ' + req.params.leaderId);
});

module.exports = leaderRouter;