const mongoose = require('mongoose');
const timestamps=require('mongoose-timestamp');

const userSchema = new mongoose.Schema({
  screen_name: {type: String, unique: true},
  name: {type: String},
  followers_count: {type: Number},
  profile_image_url: {type: String},
});

userSchema.plugin(timestamps);

const User = mongoose.model('User', userSchema);


exports.User = User;
