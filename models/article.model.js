const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const crypto    = require('crypto');
const jwt       = require('jsonwebtoken');
const validate  = require('mongoose-validator');

let CommentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

let ArticleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        validate: validate({
                     validator: 'isLength',
                     arguments: [4, 50],
                     message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters',
                 })
    },
    description: {
        type: String,
        required: true,
        /*validate: {
            validator: function(v) {
                return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }*/
    },
    image: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false,
        default: ''
    },
    comments: [CommentSchema],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

ArticleSchema.methods.toWeb = function () {
    let json = this.toJSON();
    json.id = this._id; //this is for the front end
    return json;
};


// creating the Article collection
let Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;