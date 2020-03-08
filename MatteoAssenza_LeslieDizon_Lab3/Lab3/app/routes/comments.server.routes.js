// Load the 'comments' controller
const comments = require('../controllers/comment.server.controller');

// Define the routes module' method
module.exports = function (app) {
    // Set up the 'searchstudents' routes
    app.route('/commentsbystudent')
        .get(comments.renderSearchstudents)
        .post(comments.getCommentsbystudent);

    // Set up the 'addcomment' routes
    app.route('/addcomment')
        .get(comments.renderAddComment)
        .post(comments.addComment);
};