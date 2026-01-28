-- we are going to map the Clerk user ID that we are going
-- to receive, and then store it in our database.

-- each and every user are going to have a Handle; it's basica
-- lly a username to identify our users when they are chating -- wich each other.

-- Bio is basically a description in the user profile.

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  clerk_user_id TEXT NOT NULL UNIQUE,
  display_name TEXT,
  handle TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);