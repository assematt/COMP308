const mongoose = require('mongoose');
const Article = mongoose.model('Course');
const User = require('mongoose').model('Student');
const config = require('../../config/config');
const jwt = require('jsonwebtoken');
const jwtKey = config.secretKey;

//
function getErrorMessage(err) {
    if (err.errors) {
        for (let errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].
                message;
        }
    } else {
        return 'Unknown server error';
    }
};
//
exports.create = function (req, res) {
    const article = new Article();
    article.code = req.body.code;
    article.name = req.body.name;
    article.section = req.body.section;
    article.semester = req.body.semester;
    //article.creator = req.body.username;
    console.log("Hello darkness, my old friend");
    console.log(req.body)
    //
    //
    User.findOne({ username: req.body.student }, (err, user) => {
        console.log("Found something with request: " + req.student);
        if (err) {
            console.log("user not found");
            return getErrorMessage(err);
        }
        console.log(user);
        //
        req.id = user._id;
        console.log('user._id', req.id);


    }).then(function () {
        article.student = req.id
        console.log('req.user._id', req.id);

        article.save((err) => {
            if (err) {
                console.log('error', getErrorMessage(err))

                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                res.status(200).json(article);
            }
        });

    });
};
//
exports.list = function (req, res) {
    console.log("list request: ", req.query);
    var query;
    if (req.query.user) {
        User.findOne({ username: req.query.user }, (err, user) => {
            query = Article.find({ student: user._id }).sort('-created').populate('student', 'firstName lastName fullName');

            query.exec((err, articles) => {
                if (err) {
                    return res.status(400).send({
                        message: getErrorMessage(err)
                    });
                } else {
                    res.status(200).json(articles);
                }
            });
        });
    }
    else {
        query = Article.find().sort('-created').populate('student', 'firstName lastName fullName');

        query.exec((err, articles) => {
            if (err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                res.status(200).json(articles);
            }
        });
    }    
};
//
exports.articleByID = function (req, res, next, id) {
    Article.findById(id).populate('student', 'firstName lastName fullName username').exec((err, article) => {
        if (err) return next(err);
        if (!article) return next(new Error('Failed to load article '
            + id));
        req.article = article;
        console.log('in articleById:', req.article)
        next();
    });
};
//
exports.read = function (req, res) {
    res.status(200).json(req.article);
};
//
exports.update = function (req, res) {
    console.log('in update article:', req.article)
    console.log('in update body:', req.body)

    const article = req.article;
    article.code = req.body.code;
    article.name = req.body.name;
    article.section = req.body.section;
    article.semester = req.body.semester;
    article.save((err) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.status(200).json(article);
        }
    });
};
//
exports.delete = function (req, res) {
    const article = req.article;
    article.remove((err) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.status(200).json(article);
        }
    });
};
//The hasAuthorization() middleware uses the req.article and req.user objects
//to verify that the current user is the creator of the current article
exports.hasAuthorization = function (req, res, next) {
    console.log('in hasAuthorization: ', req.article.student);
    console.log('in hasAuthorization: ', req.cookies.token);

    const token = req.cookies.token;

    try {
        // Parse the JWT string and store the result in `payload`.
        // Note that we are passing the key in this method as well. This method will throw an error
        // if the token is invalid (if it has expired according to the expiry time we set on sign in),
        // or if the signature does not match
        payload = jwt.verify(token, jwtKey);
        console.log('payload is: ', payload)
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            // if the error thrown is because the JWT is unauthorized, return a 401 error
            return res.status(401).end()
        }
        // otherwise, return a bad request error
        return res.status(400).end();
    }

    if (req.article.student.username !== payload.username) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};


