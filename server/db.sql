CREATE TABLE posts
(
  post_id SERIAL PRIMARY KEY,
  caption TEXT DEFAULT '', 
  image_urls TEXT [] NOT NULL,
  posted_by INTEGER NOT NULL,
  posted_on TIMESTAMP NOT NULL,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0
);