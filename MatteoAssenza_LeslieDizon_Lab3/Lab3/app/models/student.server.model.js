// Load the module dependencies
const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;

// Define a new 'StudentSchema'
const StudentSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        // Set an email index
        index: true,
        // Set a unique 'email' index
        unique: [ true, "Email address is already in use." ],
        required: [true, "Please input an email address."],
        // Validate the email format
        match: [/.+\@.+\..+/, "Please fill a valid e-mail address"]
    },
    password: {
        type: String,
        // Validate the 'password' value length
        validate: [
            (password) => password && password.length > 6,
            'Password should be more than 6 characters.'
        ]
    },
    favoriteProgrammingLanguage: String,
    favoriteGame: String,
    role: {
        type: String,
        // Validate the 'role' value using enum list
        enum: ["Admin", "Student"],
        default: 'Student'
    },
    created: {
        type: Date,
        // Create a default 'created' value
        default: Date.now
    },
    salt: { //to hash the password
        type: String
    },
    provider: { // strategy used to register the user
        type: String,
        required: 'Provider is required'
    },
    providerId: String, // user identifier for the authentication strategy
    providerData: {}  // to store the user object retrieved from OAuth providers
});

StudentSchema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName;
}).set(function (fullName) {
    const splitName = fullName.split(' ');
    this.firstName = splitName[0] || '';
    this.lastName = splitName[1] || '';
});

// pre-save middleware to handle the hashing of your users� passwords
StudentSchema.pre('save', function (next) {
    if (this.password) {
        // creates an autogenerated pseudo-random hashing salt
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password); //returns hashed password
    }
    next();
});

// replaces the current user password with a hashed password (more secure)
StudentSchema.methods.hashPassword = function (password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('base64');
};

//authenticates the password (hashes it and compares with hashed version in db)
StudentSchema.methods.authenticate = function (password) {
    return this.password === this.hashPassword(password);
};

StudentSchema.statics.findUniqueUsername = function (username, suffix, callback) { // find an available unique username for new users
    var _this = this;
    var possibleUsername = username + (suffix || '');
    _this.findOne({
        username: possibleUsername
    }, function (err, user) {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
        } else {
            callback(null);
        }
    });
};

StudentSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

// Create the 'Student' model out of the 'StudentSchema'
mongoose.model('Student', StudentSchema);