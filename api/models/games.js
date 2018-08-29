//Import dependencies
const mongoose = require ('mongoose');

//Create a model
const gamesSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  console: { type: String, required: true },
  genre: { type: String, required: true },
  release_year: Number,
  rating: Number,
  comment: String
});

//Export model
module.exports = mongoose.model('Games', gamesSchema);
