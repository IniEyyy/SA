CREATE DATABASE IF NOT EXISTS jomoro_auth;
USE jomoro_auth;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(25) NOT NULL DEFAULT 'CUSTOMER'
) ENGINE=InnoDB;

INSERT INTO users (first_name, last_name, email, password, role)
VALUES ('Jomoro', 'Admin', 'admin@jomoro.com', 'admin123', 'ADMIN');
