// Load the module dependencies
const students = require('../../app/controllers/student.server.controller');
const passport = require('passport');

// Define the routes module' method
module.exports = function (app) {
    app.get('/', students.render); // display the Links for other pages

	// Set up the 'signup' routes 
	app.route('/signup')
        .get(students.renderSignUp)
        .post(students.signUp);

	// Set up the 'signin' routes 
	app.route('/signin')
        .get(students.renderSignIn)
        .post(
            passport.authenticate('local',
            {
			    successRedirect: '/',
			    failureRedirect: '/signin',
			    failureFlash: true
            })
        );

    // Set up the 'displayallstudents' routes
    app.route('/displayallstudents')
        .get(students.displaystudents);

	// Set up the 'signout' route
    app.get('/signout', students.signout);

    /*
    app.get('/sign_in', students.renderSignIn); // render the login page
    app.get('/sign_up', students.renderSignUp); // render the sign up page

    // Set up the 'users' base routes
    app.route('/students').post(students.signIn);

    app.get('/sign_up', students.renderSignUp); // render the sign up page

    app.route('/display')
        .get(users.display);

    // Set up the 'users' base routes
    app.route('/users')
        .post(users.create)
        .get(users.list);

    // Set up the 'users' parameterized routes
    app.route('/users/:userId')
        .get(users.read)
        .put(users.update)
    // Set up the 'userId' parameter middleware
    app.param('userId', users.userByID);
    //
    //update from edit .ejs page
    //app.route('/edit').post(users.updateByUsername);
    //display the document in edit_ejs page
    app.route('/read_user').post(users.userByUsername);
    app.route('/delete_user').get(users.showDeletePage);
    //
    app.route('/delete').delete(users.deleteByUserName);*/
};