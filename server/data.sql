DROP TABLE IF EXISTS users, groups, trees, comments;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    img_url TEXT,
    firebase_id TEXT UNIQUE,
    is_admin BOOLEAN NOT NULL DEFAULT false   
);

CREATE TABLE groups(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    img_url TEXT,
    cover_img_url TEXT,
    is_public BOOLEAN NOT NULL DEFAULT true,
    creator INTEGER NOT NULL REFERENCES users,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trees(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    common_name TEXT,
    scientifit_name TEXT,
    description TEXT,
    img_url TEXT,
    favorites INTEGER NOT NULL DEFAULT 0,
    creator INTEGER NOT NULL REFERENCES users,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    author INTEGER NOT NULL REFERENCES users,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_trees(
    user_id INTEGER NOT NULL REFERENCES users,
    tree_id INTEGER NOT NULL REFERENCES trees
);

CREATE TABLE users_groups(
    user_id INTEGER NOT NULL REFERENCES users,
    group_id INTEGER NOT NULL REFERENCES groups,
    is_moderator BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE trees_comments(
    tree_id INTEGER NOT NULL REFERENCES trees,
    comment_id INTEGER NOT NULL REFERENCES comments
);

CREATE TABLE groups_comments(
    group_id INTEGER NOT NULL REFERENCES groups,
    comment_id INTEGER NOT NULL REFERENCES comments
);