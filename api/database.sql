CREATE TABLE person(
  id BIGSERIAL NOT NULL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  gender VARCHAR(7) NOT NULL,
  date_of_birth DATE NOT NULL,
  email VARCHAR(150)
);

-- insert data to table called "person"
INSERT INTO person(
  first_name, last_name, gender, date_of_birth
)
VALUES('adi', 'nugraha', 'male', '1990-11-26');