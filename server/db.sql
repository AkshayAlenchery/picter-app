CREATE TABLE comments 
(
  comment_id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  comment TEXT NOT NULL,
  commented_on VARCHAR(255) NOT NULL
);

CREATE TABLE likes
(
  like_id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  liked_on VARCHAR(255) NOT NULL
);

CREATE TABLE posts
(
  post_id SERIAL PRIMARY KEY,
  caption TEXT DEFAULT '', 
  image_urls TEXT [] NOT NULL,
  posted_by INTEGER NOT NULL,
  posted_on VARCHAR(255) NOT NULL,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0
);

CREATE TABLE users
(
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email_address VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  gender VARCHAR(6) NOT NULL,
  city VARCHAR(100) DEFAULT '',
  bio TEXT DEFAULT '',
  profile_pic TEXT DEFAULT '',
  followers INTEGER DEFAULT 0,
  following INTEGER DEFAULT 0,
  registered_on VARCHAR(255) NOT NULL
);