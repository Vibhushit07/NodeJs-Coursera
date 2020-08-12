const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
    .populate('user')
    .populate('favDish.dish')
    .then((favorites) => {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(favorites);

    } , (err)=>  next(err))

    .catch((err)=> next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({'postedBy': req.user._id})
    .then(favorites => {
        if(favorites) {
            for(var i = 0; i < req.body.length; i++) {
                if(favorites.dishes.indexOf(req.body[i]._id) === -1)
                    favorites.dishes.push(req.body[i]._id);
            }

            favorites.save()
            .then(updatedFavorites => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(updatedFavorites);

            }, err => next(err))

        } else {

            Favorites.create({"postedBy": req.user._id, "dishes": req.body})
            .then(updatedFavorites => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(updatedFavorites);
            }, err => next(err));
        }
    }, err => next(err))
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndDelete({ "postedBy": req.user._id })
    .then(favorites => {
        if(favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);

        } else {
            err = new Error('You have no favorites!');
            err.status = 404;
            return next(err);
        }
    })
});


favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('Get operation not supported on /favorites/' + req.params.dishId);
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({'postedBy': req.user._id})
    .then(favorites => {
        if(favorites) {
            if(favorites.dishes.indexOf(req.params.dishId) < 0) {
                favorites.dishes.push(req.params.dishId);
            } 
            favorites.save()
            .then(updatedFavorites => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(updatedFavorites);
            }, (err) => next(err));

        } else {
            Favorites.create({ "postedBy": req.user._id, "dishes": req.params.dishId })
            .then(favorite => {
                favorite.postedBy = req.user._id;
                favorite.dishes.push(req.params.dishId);
                favorite.save();
                res.json(favorite);
            }, err => next(err));
        }
    }, err => next(err))
    .catch(err => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation not supported on /favorites/' + req.params.dishId);
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({'postedBy': req.user._id})
    .then(favorites => {
        if(favorites.dishes.indexOf(req.params.dishId) > -1) {
            favorites.dishes.splice(favorites.dishes.indexOf(req.params.dishId), 1);
            favorites.save()
            .then(favorites => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites)
            }, err => next(err));

        } else {
            res.statusCode = 401;
            res.end('Dish with dishId: ' + req.params.dishId + ' not found in your favorite list');
        }
    }, err => next(err))
    .catch(err => next(err));
});



module.exports = favoriteRouter;