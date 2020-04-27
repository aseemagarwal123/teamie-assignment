
const Twitter = require('node-twitter-api');
const request = require('request');
const {User} = require('../models/User');
const {Follower} = require('../models/Follower');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
const {influence, friends, chirpy} = require('../helpers/rubric');
const jwt = require('jsonwebtoken');
const {HttpCodes, CustomErrors}=require('../response');



const twitter = new Twitter({
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  callback: process.env.CALLBACK_URL,
});

let _requestSecret;

async function connect(req, res, next) {
  twitter.getRequestToken(function(err, requestToken, requestSecret) {
    if (err) res.status(HttpCodes.INTERNAL_SERVER_ERROR).send({success: false, error: err, message: 'internal server error'});
    else {
      _requestSecret = requestSecret;
      res.redirect(
          'https://api.twitter.com/oauth/authenticate?oauth_token=' + requestToken,
      );
    }
  });
}


async function saveToken(req, res, next) {
  const requestToken = req.query.oauth_token;
  const verifier = req.query.oauth_verifier;
  token = jwt.sign({token: requestToken}, 'secret');
  twitter.getAccessToken(
      requestToken,
      _requestSecret,
      verifier,
      async function(err, accessToken, accessSecret) {
        if (err) res.status(HttpCodes.INTERNAL_SERVER_ERROR).send({success: false, error: err, message: 'internal server error'});
        else {
          twitter.verifyCredentials(accessToken, accessSecret, async function(
              err,
              response,
          ) {
            if (err) res.status(HttpCodes.INTERNAL_SERVER_ERROR).send({success: false, error: err, message: 'internal server error'});
            else {
              const user = await User.findOne({
                screen_name: response.screen_name,
              });
              if (user) {
                res.render('logged-in-view', {user, token});
              } else {
                let user = new User({
                  screen_name: response.screen_name,
                  name: response.name,
                  followers_count: response.followers_count,
                  profile_image_url: response.profile_image_url,
                });
                user = await user.save();
                res.render('logged-in-view', {user, token});
              }
            }
          });
        }
      },
  );
}

async function followers(req, res, next) {
  const oauth = OAuth({
    consumer: {
      key: process.env.CONSUMER_KEY,
      secret: process.env.CONSUMER_SECRET,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return crypto
          .createHmac('sha1', key)
          .update(base_string)
          .digest('base64');
    },
  });

  const request_data = {
    url: 'https://api.twitter.com/1.1/followers/list.json?screen_name=' +
    req.query.screen_name,
    method: 'GET',
  };

  const token = {
    key: process.env.TOKEN_KEY,
    secret: process.env.TOKEN_SECRET,
  };
  request(
      {
        url: request_data.url,
        method: request_data.method,

        headers: oauth.toHeader(oauth.authorize(request_data, token)),
      },
      async function(error, response, body) {
        const followers = JSON.parse(body).users;
        const result = followers.map(function(el) {
          const o = Object.assign({}, el);
          o.followed_screen_name = req.query.screen_name;
          return o;
        });
        Follower.insertMany(result, {ordered: false});
        res.status(HttpCodes.OK).send({success: true, Response: result, message: 'fetch sucessfull'});
      },
  );
}

async function rubric(req, res, next) {
  let follower = await Follower.findOne(
      {id: req.params.id},
      {_id: 0, __v: 0},
  );
  const Influence = influence(
      follower.followers_count,
      follower.listed_count,
      follower.statuses_count,
  );
  const Friends = friends(follower.friends_count);
  const Chirpy = chirpy(
      follower.friends_count,
      follower.favourites_count,
      follower.statuses_count,
  );
  const score = {
    influence: Influence,
    friends: Friends,
    chirpy: Chirpy,
    total: Influence + Friends + Chirpy,
  };
  follower = JSON.parse(JSON.stringify(follower));
  follower.rubric = score;
  res.status(HttpCodes.OK).send({success: true, Response: follower, message: 'internal server error'});
}

module.exports = {
  connect, saveToken, followers, rubric,

};


