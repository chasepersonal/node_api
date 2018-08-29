const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Import database model
const Games = require('../models/games');

//Find necessary data for GET request
router.get('/', (req, res, next) => {
  Games.find()
  //Select only appropriate fields for GET request
  .select("_id title console genre release_year rating commment")
  .exec()
  .then(docs => {
    //Retrive count of number of items fetched with GET request
    //Store in docs variable
    const response = {
      count: docs.length,
      //Map games data to get additional metdata with the GET request
      games: docs.map(doc => {
        return {
          _id: doc.id,
          title: doc.title,
          console: doc.console,
          genre: doc.genre,
          release_year: doc.release_year,
          rating: doc.rating,
          comment: doc.comment,
          request: {
            type: 'GET',
            url: 'http://localhost:8081/games/' + doc._id
          }
        }
      })
    };
    res.status(200).json(response);
  }).catch(err => {
    //Log error to console and send HTTP error
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

router.post('/', (req, res, next) => {

  //Create database model object to allow data to be posted to database
  const game = new Games({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    console: req.body.console,
    genre: req.body.genre,
    release_year: body.release_year,
    rating: body.rating,
    comment: body.comment,
  });

  //Save to database and log to the console
  //Also log errors to the console
  game.save().then(result => {
    console.log(result);
    //Send successful status message here so it passes through the data check
    res.status(201).json({
      message: 'Game Entry was posted',
      //Send POST data with necessary information and metadata
      createdGame: {
        title: result.title,
        console: result.console,
        genre: result.genre,
        _id: result.id,
        release_year: result.release_year,
        rating: result.rating,
        comment: result.comment,
        request: {
          type: 'POST',
          url: 'http://localhost:8081/games/' + result._id
        }
      }
    });
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

//Get single game information
router.get('/:gameId', (req, res, next) => {
  const id = req.params.gameId;
  Games.findById(id)
  .select("title console genre _id")
  .exec()
  .then(doc => {
    console.log("From database", doc);
    if (doc) {
      res.status(200).json({
        Game: doc,
        request: {
          type: 'GET',
          description: 'GET_SINGLE_GAME',
          url: 'http://localhost:8081/games/' + doc._id
        }
      });
    } else {
      res.status(404).json({
        message: 'No valid entry found for provided ID'
      });
    }
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

//Update single game information
router.patch("/:gameId", (req, res, next) => {
  const id = req.params.gameId;
  //Assign array varaible to assist with updates
  const updateOps = {};
  //Loop through entries to see what needs updating
  for (const ops of req.body) {
    //Check for specific update area and assign a value if it needs updated
    updateOps[ops.propName] = ops.value;
  }
  //Match id's to ensure successful update and set the updated values
  Games.update({ _id: id }, { $set: updateOps }).exec().then(result => {
    res.status(200).json({
      message: "Game Information Updated",
      request: {
        type: 'PATCH',
        url: 'http://localhost:8081/games/' + id
      }
    });
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

router.delete('/:gameId', (req, res, next) => {
  const id = req.params.gameId;
  Games.remove({
    //Match id's to ensure successful removal
    _id: id
  }).exec().then(result => {
    res.status(200).json(result);
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

module.exports = router;
