const Student = require('mongoose').model('Student'); // Load the 'Student' Mongoose model
const Comment = require('mongoose').model('Comment'); // Load the 'Comment' Mongoose model

// 'display' controller method to display all users in friendly format
exports.renderSearchstudents = function (req, res, next) {
    // If user is not connected render the signup page, otherwise redirect the user back to the main application page
    if ( req.user )
    {
        if ( req.user.role === "Admin" )
        {
            var email = req.body.email;

            // Use the 'response' object to render the signup page
            res.render('searchstudent', {
                // Set the page title variable
                title: 'Search comments by Student',
                // read the message from flash variable
                badmessage: req.flash('error'), //passes the error stored in flash
                email: email,
                user: req.user
            });
        }
        else {
            res.render('error', {
                title: 'Please Login as Admin',
                errMsg: 'Please Login as Admin!'
            });
        }
    }
    else {
        res.render('error', {
            title: 'Please Login as Admin',
            errMsg: 'Please Login as Admin!'
        });
    }
};


// 'display' controller method to display all users in friendly format
exports.getCommentsbystudent = function (req, res, next) {
    if (req.user) {
        if (req.user.role === "Admin") {
            var email = req.body.email;
            var studentid;
 
            // Use the 'User' static 'find' method to retrieve the list of users
            Student.findOne({ email: email }, (err, users) => {
                console.log(users);
                studentid = users._id;

                if (err) {
                    // Call the next middleware with an error message
                    return next(err);
                }
            }).then(function () {
                //find the posts from this author
                Comment.find({ student: studentid }, ( err, comments ) => {
                    if (err) { return getErrorMessage(err); }
                    //res.json(comments);
                    res.render('comments', {
                        // Set the page title variable
                        title: 'Comments by Student',
                        comments: comments,
                        email: email,
                        user: req.user
                    });
                });
            });
        }
        else
        {
            res.render('error', {
                title: 'Please Login as Admin',
                errMsg: 'Please Login as Admin!'
            });
        }
    }
    else {
        res.render('error', {
            title: 'Please Login as Admin',
            errMsg: 'Please Login as Admin!'
        });
    }
};

// Create a new controller method that renders the signup page
exports.renderAddComment = function (req, res, next) {
    // If user is not connected render the signup page, otherwise redirect the user back to the main application page
    if ( req.user ) {
        // Create a new 'Student' model instance
        const comment = new Comment();

        // Use the 'response' object to render the signup page
        res.render('comment', {
            // Set the page title variable
            title: 'Submit a Comment',
            // read the message from flash variable
            badmessage: req.flash('error'), //passes the error stored in flash
            comment: comment,
            user: req.user
        });
    }
    else {
        res.render('error', {
            title: 'Please Login',
            errMsg: 'Please login first!'
        });
    }
};

// Create a new controller method that creates new 'regular' users
exports.addComment = function (req, res, next) {
    if ( req.user ) {
        // Create a new 'Student' model instance
        const user = new Comment(req.body);
        console.log(req.body)
        const message = null;

        // Set the user provider property
        user.provider = 'local';

        // Try saving the new user document
        user.save((err) => {
            // If an error occurs, use flash messages to report the error
            if (err) {
                // Use the error handling method to get the error message
                const message = getErrorMessage(err);
                console.log(err)
                // save the error in flash
                req.flash('error', message); //save the error into flash memory

                // Redirect the user back to the signup page
                return res.render('comment', {
                    // Set the page title variable
                    title: 'Submit a Comment',
                    // read the message from flash variable
                    badmessage: req.flash('error'), //passes the error stored in flash
                    user: req.user
                });
            }
            else
            {
                res.render('thankyou', {
                    title: 'Thank you for completing the course evaluation',
                    comment: req.body,
                    user: req.user
                });
            }
        });
    }
    else {
        res.render('error', {
            title: 'Please Login',
            errMsg: 'Please login first!'
        });
    }
};