CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;
DROP TABLE IF EXISTS users, groups, trees, comments, users_trees, users_groups, trees_comments, groups_comments, groups_trees CASCADE;

CREATE TABLE users(
    firebase_id TEXT PRIMARY KEY UNIQUE,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    img_url TEXT,
    home_geolocation POINT,
    is_admin BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE groups(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    storage_url TEXT,
    is_public BOOLEAN NOT NULL DEFAULT true,
    creator TEXT NOT NULL REFERENCES users ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trees(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    common_name TEXT,
    scientific_name TEXT,
    description TEXT,
    storage_url TEXT,
    geolocation POINT NOT NULL,
    favorites INTEGER NOT NULL DEFAULT 0,
    creator TEXT NOT NULL REFERENCES users ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    author TEXT NOT NULL REFERENCES users ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_trees(
    user_id TEXT NOT NULL REFERENCES users ON DELETE CASCADE,
    tree_id INTEGER NOT NULL REFERENCES trees ON DELETE CASCADE
);

CREATE TABLE users_groups(
    user_id TEXT NOT NULL REFERENCES users ON DELETE CASCADE,
    group_id INTEGER NOT NULL REFERENCES groups ON DELETE CASCADE,
    is_moderator BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE trees_comments(
    tree_id INTEGER NOT NULL REFERENCES trees ON DELETE CASCADE,
    comment_id INTEGER NOT NULL REFERENCES comments ON DELETE CASCADE
);

CREATE TABLE groups_comments(
    group_id INTEGER NOT NULL REFERENCES groups ON DELETE CASCADE,
    comment_id INTEGER NOT NULL REFERENCES comments ON DELETE CASCADE
);
CREATE TABLE groups_trees(
    group_id INTEGER NOT NULL REFERENCES groups ON DELETE CASCADE,
    tree_id INTEGER NOT NULL REFERENCES trees ON DELETE CASCADE
);