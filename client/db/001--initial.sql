CREATE TABLE races (
  race_id INT PRIMARY KEY,
  date DATE,
  start_time TIME,
  location VARCHAR(50),
  marshalls INT NOT NULL,
  finished BOOL NOT NULL
);

CREATE TABLE times (
  upload_order INTEGER PRIMARY KEY,
  race_id INT REFERENCES races(race_id),
  runner_id INT(5) NOT NULL,
  "time" TIME NOT NULL
);