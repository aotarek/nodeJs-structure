const {to, ReE, ReS} = require('../utils/utils');
const {check, validationResult, body} = require('express-validator/check');
const Article = require('../models/article.model');
const CutomError = require('../utils/customError');

const create = async function (req, res, next) {
    try {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // return res.status(422).json({errors: errors.array()});
            return ReE(res, errors.array(), 422);

        }

        const {payload} = req;
        if (!payload) {
            let err = new CutomError('User not found', 'unknown');
            return ReE(res, err, 401);
        }

        //validate incoming params
        /*if (!req.body.title || !req.body.description) {
            return res.status(422).json({"message": "Some fields are required"});
        }*/

        req.body.owner = payload.id;
        let article = new Article(req.body);

        let [err, _article] = await to(article.save());
        if (err) return ReE(res, err, 422);

        return ReS(res, _article.toWeb(), 201, 'Successfully created new article.', 'article.create');
    } catch (error) {
        let err = new CutomError(error.message, 'unknown');
        return ReE(res, err, 400);
    }
};
module.exports.create = create;


const getAll = async function (req, res, next) {
    Article.find({})
    //.populate('comments.author')
    //.populate('owner')
        .then((articles) => {
            ReS(res, articles, 200, 'Successfully retrieved.', 'article.getAll');
        })
        .catch((err) => next(err));
};
module.exports.getAll = getAll;


const removeAll = async function (req, res, next) {
    Article.remove({})
        .then((result) => {
            ReS(res, result, 200, 'Successfully removed.', 'article.removeAll');
        }, (err) => next(err))
        .catch((err) => next(err));
};
module.exports.removeAll = removeAll;

const putAllNotAllowed = async function (req, res, next) {
    let err = new Error('PUT operation not supported on /articles');
    err.status = 405;
    return next(err);
};
module.exports.putAllNotAllowed = putAllNotAllowed;

const postNotAllowed = async function (req, res, next) {
    let err = new Error('POST operation not supported on /articles/' + req.params.leaderId);
    err.status = 405;
    return next(err);
};
module.exports.postNotAllowed = postNotAllowed;


const get = async function (req, res, next) {
    try {
        let articleId = req.params.articleId;

        let [err, article] = await to(Article.findById(articleId));
        if (err) {
            let err = new CutomError('Error finding article', 'unknown');
            return ReE(res, err, 422);
        }

        if (!article) {
            let err = new CutomError(`ArticleId not found with id: ${articleId}`, 'unknown');
            return ReE(res, err, 422);
        }

        return ReS(res, article.toWeb(), 200, 'Successfully retrieved.', 'article.get');
    } catch (error) {
        let err = new CutomError(error.message, 'unknown');
        return ReE(res, err, 400);
    }
};
module.exports.get = get;

const update = async function (req, res, next) {
    try {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        /*const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }*/

        let articleId = req.params.articleId;
        let [err, article] = await to(Article.findByIdAndUpdate(articleId, {$set: req.body}, {new: true}));

        if (err) {
            let err = new CutomError('Error occured trying to update the article', 'unknown');
            return ReE(res, err, 422);
        }

        return ReS(res, article.toWeb(), 200, 'Successfully updated.', 'article.update');
    } catch (error) {
        let err = new CutomError(error.message, 'unknown');
        return ReE(res, err, 400);
    }
};
module.exports.update = update;


const remove = async function (req, res, next) {
    try {
        let articleId = req.params.articleId;
        let [err, result] = await to(Article.findByIdAndRemove(articleId));

        if (err) {
            let err = new CutomError('Error occured trying to delete the article', 'unknown');
            return ReE(res, err, 422);
        }

        return ReS(res, result, 200, 'Successfully deleted.', 'article.remove');
    } catch (error) {
        let err = new CutomError(error.message, 'unknown');
        return ReE(res, err, 400);
    }
};
module.exports.remove = remove;