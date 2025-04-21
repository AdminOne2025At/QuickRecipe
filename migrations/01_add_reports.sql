-- Create reports and saved posts tables
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS reports integer DEFAULT 0 NOT NULL;

CREATE TABLE IF NOT EXISTS post_reports (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES community_posts(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  reason TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS saved_posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  post_id INTEGER NOT NULL REFERENCES community_posts(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
