var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Dish = require('./dishes');


var dish = {
    type: mongoose.Schema.Types.ObjectId,
    ref: Dish.schema
}

var favoriteSchema = new Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    dishes: [ dish ]
}, {
    timestamps: true
});

var Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;