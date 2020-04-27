const mongoose = require('mongoose');
const timestamps=require('mongoose-timestamp');

const followerSchema = new mongoose.Schema({
  followers_count: {type: Number},
  friends_count: {type: Number},
  listed_count: {type: Number},
  favourites_count: {type: Number},
  statuses_count: {type: Number},
  screen_name: {type: String},
  id: {type: Number, unique: true},
  followed_screen_name: {type: String},
});

followerSchema.plugin(timestamps);

const Follower = mongoose.model('Follower', followerSchema);


exports.Follower = Follower;
