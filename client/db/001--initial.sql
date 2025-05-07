-- Up

CREATE TABLE races (
  race_id INT PRIMARY KEY,
  date DATE,
  start_time TIME,
  location VARCHAR(50)
);

CREATE TABLE times (
  time_id SERIAL PRIMARY KEY,
  race_id INT REFERENCES races(race_id),
  runner_id INT(5) NOT NULL UNIQUE,
  time TIME NOT NULL
);

/*
INSERT INTO Messages (id, msg, time) VALUES
( 'xnshfdsafasd',
  'these are three default messages',
  datetime('now')),
( 'dskjdshkjhsd',
  'delivered from the server',
  datetime('now')),
( 'vcxbxcvfggzv',
  'using a custom route',
  datetime('now'));*/


-- Down

//DROP TABLE Messages;