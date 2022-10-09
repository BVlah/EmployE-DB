DROP DATABASE IF EXISTS employe_db;
CREATE DATABASE employe_db;
USE employe_db;

CREATE TABLE department (
    id INTEGER auto_increment primary key,
    name VARCHAR(30) not null
);

CREATE TABLE role (
    id INTEGER auto_increment primary key,
    title VARCHAR(30) not null,
    salary DECIMAL not null,
    department_id INTEGER not null
);

CREATE TABLE employee (
    id INTEGER auto_increment primary key,
    first_name VARCHAR(30) not null,
    last_name VARCHAR(30) not null,
    role_id INTEGER not null,
    manager_id INTEGER
);