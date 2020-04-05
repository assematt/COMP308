// Load the 'index' controller
const index = require('../controllers/index.server.controllers');

// Define the routes module' method
module.exports = function (app) {
    // Mount the 'index' controller's 'render' method
    app.route("/").get(index.uploadJson);

    app.route("/userInput").get(index.userInput);

    app.route("/prepareTFModel").post(index.prepareTFModel);

    app.route("/processData").post(index.processData);
};