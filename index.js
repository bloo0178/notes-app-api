/*'use strict';

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }, null, 2),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};*/

const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const projects = require('./handlers/projects');
const express = require("express");
const app = express();

require("dotenv").config();

app.use(bodyParser.json({ strict: false }));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

app.use('/projects', projects); 

/*
app.listen(3000, () => {
	console.log("App listening on port 3000");
});
*/

module.exports.handler = serverless(app);
