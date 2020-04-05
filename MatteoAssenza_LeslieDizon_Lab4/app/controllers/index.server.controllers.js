//https://hackernoon.com/neural-networks-from-scratch-for-javascript-linguists-part1-the-perceptron-632a4d1fbad2
var PerceptronModel = require('./PerceptronModel');

const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node");

var tensorModel;
var dataFromJSON;

exports.uploadJson = (req, res) => {
    res.render("upload_json");
};

exports.userInput = (req, res) => {
    res.render("user_input");
};

// Create a new 'render' controller method
exports.render = function (req, res) {
    // If the session's 'lastVisit' property is set, print it out in the console 
    if (req.session.lastVisit) {
        console.log(req.session.lastVisit);
    }

    // Set the session's 'lastVisit' property
    req.session.lastVisit = new Date();

    // Use the 'response' object to render the 'index' view with a 'title' property
    res.render('index', {
        title: 'Simple Perceptron Exasmples'
    });
};

exports.prepareTFModel = (req, res, next) => {
    console.log("got here...1");
    var form = new formidable.IncomingForm();

    form.uploadDir = "public/json_uploads";

    //Rename file to original filename
    form.on("file", (field, file) => {
        console.log("got here...2");

        fs.rename(file.path, form.uploadDir + "/" + file.name, err => {
            if (err) 
            {
                console.log(err);
            }
        });

        req.filename = file.name;
        console.log("file.name: " + file.name);
        
        console.log("got here...3");
    });

    form.parse(req, (err, fields, files) => {
        console.log("got here...4");
        if (err) 
        {
            console.log(err);
        }

        var filePath = path.join(__dirname, "../../" + form.uploadDir + "/" + req.filename);
        console.log("filePath: " + filePath);

        console.log("got here...5");
        fs.readFile(filePath, (err, data) => {
            //Provided file is utf-8 BOM, we need to remove endianess
            dataFromJSON = JSON.parse(data.toString("utf8").replace(/^\uFEFF/, ""));
            tensorModel = prepareTensorModel();
        });

        res.render("user_input");
    });
};

var prepareTensorModel = () => {
    // we use a sequential neural network
    const model = tf.sequential();

    //add the first layer
    model.add(
        tf.layers.dense({
            inputShape: [4], // four features
            activation: "sigmoid",
            units: 5 // five hidden layers
        })
    );

    //add the hidden layer
    model.add(
        tf.layers.dense({
            inputShape: [5],
            activation: "sigmoid",
            units: 3 //3 output categorizations
        })
    );

    //add output layer
    model.add(
        tf.layers.dense({
            activation: "sigmoid",
            units: 3 //dimension of final output
        })
    );

    return model;
};

exports.processData = (req, res) => {
    var dataFromUSER = [{
        sepal_length: +req.body.sepalLength,
        sepal_width: +req.body.sepalWidth,
        petal_length: +req.body.petalLength,
        petal_width: +req.body.petalWidth
    }];

    getPrediction(
        tensorModel,
        { 
            training: dataFromJSON, 
            test: dataFromUSER 
        },
        {
            epoch: req.body.epoch,
            learningRate: req.body.learningRate
        },
        data => {
            res.render("results", { data });
        }
    );
};

const IRIS_CLASSES = ['Iris-setosa', 'Iris-versicolor', 'Iris-virginica'];

var getPrediction = (model, data, parameters, callback) => {
    const trainingData = tf.tensor2d(
        data.training.map(item => [
            item.sepal_length,
            item.sepal_width,
            item.petal_length,
            item.petal_width
        ])
    );

    const testingData = tf.tensor2d(
        data.test.map(item => [
            item.sepal_length,
            item.sepal_width,
            item.petal_length,
            item.petal_width
        ])
    );

    const outputData = tf.tensor2d(
        data.training.map(item => [
            item.species === "setosa" ? 1 : 0,
            item.species === "virginica" ? 1 : 0,
            item.species === "versicolor" ? 1 : 0
        ])
    );

    model.compile({
        loss: "meanSquaredError",
        optimizer: tf.train.adam( parameters.learningRate )
    });

    model.fit(trainingData, outputData, { epochs: parameters.epoch }).then(history => {
        const predictOut = model.predict(testingData);
        const logits = Array.from(predictOut.dataSync());

        var logitsSpan = [];

        logits.forEach((v) => {
            console.log("The value of a is : " + v.toFixed(3));
            logitsSpan.push(v.toFixed(3));
        });

        console.log(predictOut.argMax(-1).dataSync()[0]);

        const winner = IRIS_CLASSES[predictOut.argMax(-1).dataSync()[0]];
        var payload = {
            logits: logitsSpan,
            winner: winner
        };
        console.log("logits: " + logitsSpan);
        console.log("winner: " + winner);
        
        callback(payload);
    });
};

/*
*******************
* AND gate example
* *****************
*/
exports.andGate = function (req, res) {
    // Create the model
    var p = new PerceptronModel();
    
    // Train the model with input with a diagonal boundary, AND gate.
    
    for (var i = 0; i < 5; i++) {
        p.train([1, 1], 1);
        p.train([0, 1], 0);
        p.train([1, 0], 0);
        p.train([0, 0], 0);
    }
    p.predict([0, 0]); // 0
    p.predict([0, 1]); // 0
    p.predict([1, 0]); // 0
    p.predict([1, 1]); // 1

    // The perceptron has learned enough to classify correctly:
    result = p.predict([1, 1]) //1

    // Use the 'response' object to render the 'index' view with a 'classificationResult' property
    res.render('./and_gate.ejs', {
        classificationResult: JSON.stringify(result),
        
    });  
    

};
//

//
// Using perceptron as a linear classifier
//
exports.linearClassifier = function (req, res) {  
    
    //Friendly or not friendly example using teeth and size features
    //
    //normalized teeth and size features
    //X1 data
    var X1 = [0.27, 0.09, 0.00, 0.23, 0., 1.00, 0.32];
    //X2 data
    var X2 = [0.50, 0.48, 0.12, 0.00, 1.00, 0.73, 0.33];

    //labels data
    var labels = [1, 1, 1, 0, 1, 0, 0];

    var data = [];

    // Create the model
    var p = new PerceptronModel();
    // Train the model
    for (var i = 0; i < 100; i++) {
        for (let i = 0; i < X1.length; i++) {
            p.train([X1[i], X2[i]], labels[i]);

        }
    }
    //
    console.log('weights and bias: ')
    console.log(p.bias)
    console.log(p.weights)
    var weights = p.weights;
    var bias = p.bias;

    //y = (-w1/w2)x + (-bias/w2) = a*x + b
    //line coefficients
    var a = -weights[0] / weights[1];
    var b = -bias / weights[1];

    console.log('a and b: ')

    console.log(a)
    console.log(b)
    //calculating tw0 points to draw the line
    //x2 = a*x1 +b : x1 = 0 --> x2 = b, x1 = 1 --> x2 = a + b
    // line points:  (0,b) and (1, a+b)

    //It is important to notice that it will converge to any solution
    //that satisfies the training set.
    //Try to retrain to see if it changes.

    // Now we can use it to categorize samples it's never seen.
    // For example: something with 29 teeth and a size of 23 cm, likely to be nice ?
    predictionResult = p.predict([
        "0.46",
        "0.07"
    ]);

    console.log("prediction: ", predictionResult);
    //prepare data values for the chart
    for (let i = 0; i < X1.length; i++) {
        
        data[i] = { x: X1[i], y: X2[i]  };

    }
    console.log('data: ', data[0])

    console.log('data: ', data)

    // Use the 'response' object to render the 'index' view with a 'classificationResult' property
    res.render('./results.ejs', {
        dataPoints: data,
        predictionResult: predictionResult,
        a: a,
        b: b,
    });  

};


// Create a new 'render' controller method
exports.someClassifier = function (req, res) {
   
    
    
    // Create a perceptron model:
    var p = perceptron()

    // Train with a feature vector [0] that has label 1,
    //        and a feature vector [1] that has label 0.
    p.train([0], 1);
    p.train([1], 0);
    p.train([0], 1);

    // The perceptron has learned enough to classify correctly:
    result = p.predict([0]);
    // 1
    //p.predict([1])
    // 0
    console.log(result);

    // Use the 'response' object to render the 'index' view with a 'classificationResult' property
    res.render('./some_classifier.ejs', {
        classificationResult: JSON.stringify(result)
        
    });    

};

// # [Perceptron Classifier](http://en.wikipedia.org/wiki/Perceptron)
// https://planspace.org/20150610-a_javascript_perceptron/perceptron.js
//https://github.com/simple-statistics/simple-statistics/blob/master/src/perceptron.js
// This is a single-layer perceptron classifier that takes
// arrays of numbers and predicts whether they should be classified
// as either 0 or 1 (negative or positive examples).
function perceptron() {
    //
    var perceptron_model = {},
        // The weights, or coefficients of the model;
        // weights are only populated when training with data.
        weights = [],
        // The bias term, or intercept; it is also a weight but
        // it's stored separately for convenience as it is always
        // multiplied by one.
        bias = 0;

    // ## Predict
    // Use an array of features with the weight array and bias
    // to predict whether an example is labeled 0 or 1.
    perceptron_model.predict = function (features) {
        // Only predict if previously trained
        // on the same size feature array(s).
        if (features.length !== weights.length) return null;
        // Calculate the sum of features times weights,
        // with the bias added (implicitly times one).
        var score = 0;
        for (var i = 0; i < weights.length; i++) {
            score += weights[i] * features[i];
        }
        score += bias;
        // Classify as 1 if the score is over 0, otherwise 0.
        return score > 0 ? 1 : 0;
    };

    // ## Train
    // Train the classifier with a new example, which is
    // a numeric array of features and a 0 or 1 label.
    perceptron_model.train = function (features, label) {
        // Require that only labels of 0 or 1 are considered.
        if (label !== 0 && label !== 1) return null;
        // The length of the feature array determines
        // the length of the weight array.
        // The perceptron will continue learning as long as
        // it keeps seeing feature arrays of the same length.
        // When it sees a new data shape, it initializes.
        if (features.length !== weights.length) {
            weights = features;
            bias = 1;
        }
        // Make a prediction based on current weights.
        var prediction = perceptron_model.predict(features);
        // Update the weights if the prediction is wrong.
        if (prediction !== label) {
            var gradient = label - prediction;
            for (var i = 0; i < weights.length; i++) {
                weights[i] += gradient * features[i];
            }
            bias += gradient;
        }
        return perceptron_model;
    };

    // Conveniently access the weights array.
    perceptron_model.weights = function () {
        return weights;
    };

    // Conveniently access the bias.
    perceptron_model.bias = function () {
        return bias;
    };

    // Return the completed model.
    return perceptron_model;
};
