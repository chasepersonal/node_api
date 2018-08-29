//Import package libraries

const express = require('express');
const app = express();
const log = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Import Routes
const gameRoutes = require('./api/routes/games');

//Connect to database
mongoose.connect("mongodb://metalhero:P0rcupin3Tr33@cluster0-shard-00-00-lsejy.mongodb.net:27017,cluster0-shard-00-01-lsejy.mongodb.net:27017,cluster0-shard-00-02-lsejy.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin")

//Log api calls within the terminal
app.use(log('dev'));

//Parse URL ecnoded data
app.use(bodyParser.urlencoded({extended: false}));

//Parse Json data
app.use(bodyParser.json());

//Add headers to allow access to server
app.use((req, res, next) => {

  //Allow all CORS origins to be accessed
  res.header("Access-Control-Allow-Origin", "*");

  //Allow certain CORS headers to be accessed
  res.header(
    "Access-Control-Allow-headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  //If HTTP request has the OPTIONS method, allow other HTTP method requests
  //Will notify browser to allow HTTP method requests from the API
  if(req.method === 'OPTIONS') {

    //Send header to allow HTTP method requests to be used
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');

    //Allow successful json response after sending CORS validation
    return res.status(200).json({});
  }

  //Proceed to next routes
  next();
});

//Create custom response for successful API transmission
app.use('/games', gameRoutes);

//Display error message for incompatible route call
app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
});

//Display error message for all errors
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
