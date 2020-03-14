// Load the Mongoose module and Schema object
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//define a new CourseSchema
const CourseSchema = new Schema({
    code: {
        type: String,
        // Validate 'code' value existance
        required: 'Course code is required',
        // Trim the 'code' field
        trim: true
    },
    name: {
        type: String,
        default: '',
        trim: true,
        required: 'The course name cannot be blank'
    },
    section: {
        type: String,
        trim: true,
        required: 'The course section cannot be blank'
    },
    semester: {
        type: String,
        trim: true,
        required: 'The course semester cannot be blank'
    },
    created: {
        type: Date,
        default: Date.now
    },
    student: {
        type: Schema.ObjectId,
        ref: 'Student'
    }
});

// Configure the 'CourseSchema' to use getters and virtuals when transforming to JSON
CourseSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

mongoose.model('Course', CourseSchema);