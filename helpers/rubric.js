

function influence(followers_count, friends_count, listed_count, favourites_count, statuses_count) {
  if (followers_count > 10000) {
    var influence = 4;
  } else if ((followers_count>2000 && followers_count<10000 && (listed_count/followers_count* 100 >= 2))) {
    var influence = 3.5;
  } else if ((followers_count>2000 && followers_count<10000 && (statuses_count/followers_count* 100 >= 4))) {
    var influence = 3;
  } else if (followers_count>2000 && followers_count<10000) {
    var influence = 2;
  } else {
    var influence = 1;
  }
  return influence;
}


function friends(friends_count) {
  if (friends_count<2000) {
    var friends = 0;
  }
  if (friends_count>=2000 && friends_count<=10000) {
    var friends = 1;
  } else {
    var friends = 2;
  }
  return friends;
}

function chirpy(friends_count, favourites_count, statuses_count) {
  if (friends_count > 2000 && favourites_count>2000 && statuses_count>2000) {
    var chirpy = 4;
  } else if (friends_count > 2000 && favourites_count>2000) {
    var chirpy = 3.5;
  } else if (friends_count > 2000) {
    var chirpy = 3;
  } else if (friends_count < 2000 && favourites_count > 2000 && statuses_count>2000) {
    var chirpy = 2.5;
  } else if (friends_count < 2000 && favourites_count < 2000 && statuses_count>2000) {
    var chirpy = 2;
  } else {
    var chirpy = 1;
  }
  return chirpy;
}

module.exports = {
  influence,
  friends,
  chirpy,
};
