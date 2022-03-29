CREATE DATABASE social_media;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    OTP VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255) NOT NULL,
    google_id VARCHAR NOT NULL UNIQUE
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    body VARCHAR(255) NOT NULL,
    author_id INT references users(id) NOT NULL
);