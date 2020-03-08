const Student = require('mongoose').model('Student'); // Load the 'Student' Mongoose model
const passport = require('passport');

// Create a new error handling controller method
const getErrorMessage = function (err) {
    // Define the error message variable
    var message = '';

    // If an internal MongoDB error occurs get the error message
    if (err.code) {
        switch (err.code) {
            // If a unique index error occurs set the message error
            case 11000:
            case 11001:
                message = 'Email is already in use!';
                break;
            // If a general error occurs set the message error
            default:
                message = 'Something went wrong';
        }
    } else {
        // Grab the first error message from a list of possible errors
        for (const errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].message;
        }
    }

    // Return the message error
    return message;
};

exports.render = function (req, res) {
    res.render('index', {
        title: 'Course Evaluation',
        userFullName: req.user ? req.user.fullName : '',
        user: req.user
    });
};

// Create a new controller method that renders the signin page
exports.renderSignIn = function (req, res, next) {
    // If user is not connected render the signin page, otherwise redirect the user back to the main application page
    if ( !req.user ) {
        // Use the 'response' object to render the signin page
        res.render('signin', {
            // Set the page title variable
            title: 'Sign In as Student',
            // Set the flash message variable
            messages: req.flash('error') || req.flash('info')
        });
    } else {
        res.redirect('/');
    }
};

// Create a new controller method that renders the signup page
exports.renderSignUp = function (req, res, next) {
    // If user is not connected render the signup page, otherwise redirect the user back to the main application page
    if (!req.user) {
        // Create a new 'Student' model instance
        const user = new Student();

        // Use the 'response' object to render the signup page
        res.render('signup', {
            // Set the page title variable
            title: 'Sign Up as Student',
            // read the message from flash variable
            badmessage: req.flash('error'), //passes the error stored in flash
            user: user
        });
    }
    else
    {
        res.render('error', {
            title: 'Already Logged In',
            errMsg: 'Already Logged In! Logout first before trying to sign up again.'
        });
    }
};

// Create a new controller method that creates new 'regular' users
exports.signUp = function (req, res, next) {
    // If user is not connected, create and login a new user, otherwise redirect the user back to the main application page
    if ( !req.user ) {
        // Create a new 'Student' model instance
        const user = new Student(req.body);
        console.log(req.body);
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
                return res.render('signup', {
                    // Set the page title variable
                    title: 'Sign Up as Student',
                    // read the message from flash variable
                    badmessage: req.flash('error'), //passes the error stored in flash
                    user: user
                });
            }

            // If the user was created successfully use the Passport 'login' method to login
            req.login(user, (err) => {
                // If a login error occurs move to the next middleware
                if (err) return next(err);

                // Redirect the user back to the main application page
                return res.redirect('/');
            });
        });
    }
    else
    {
        res.render('error', {
            title: 'Already Logged In',
            errMsg: 'Already Logged In! Logout first before trying to sign up again.'
        });
    }
};

// 'display' controller method to display all users in friendly format
exports.displaystudents = function (req, res, next) {
    if ( req.user )
    {
        // Use the 'User' static 'find' method to retrieve the list of users
        Student.find({ role: "Student" }, (err, users) => {
            if (err) {
                // Call the next middleware with an error message
                return next(err);
            } else {
                // Use the 'response' object to send a JSON response
                res.render('students', {
                    title: 'Display All Students',
                    users: users,
                    user: req.user
                });
            }
        });
    }
    else
    {
        res.render('error', {
            title: 'Please Login',
            errMsg: 'Please login first!'
        });
    }
};

// Create a new controller method for signing out
exports.signout = function (req, res) {
    // Use the Passport 'logout' method to logout
    req.logout();

    // Redirect the user back to the main application page
    res.redirect('/');
};