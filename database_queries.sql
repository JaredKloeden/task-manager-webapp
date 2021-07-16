/*Creating databases*/

CREATE TABLE User (
id INT,
first_name VARCHAR(30),
last_name VARCHAR(30),
date_of_birth VARCHAR(10),
username VARCHAR(20),
password VARCHAR(40),
email VARCHAR (100),
privleges INT,
PRIMARY KEY (id)
);

CREATE TABLE Profile (
profile_id INT,
profile_picture VARCHAR(100),
bio VARCHAR(500),
position VARCHAR(50),
hobbies VARCHAR(300);
education VARCHAR(50),
availability VARCHAR(100),
FOREIGN KEY (profile_id) REFERENCES User(id) ON DELETE CASCADE
);

CREATE TABLE Task (
id INT,
name VARCHAR(30),
short_description VARCHAR(50),
long_description VARCHAR(1000),
creation_date VARCHAR(10),
due_date VARCHAR(10),
PRIMARY KEY (id)
);

CREATE TABLE Assignments (
assignment_id INT,
user_id INT,
task_id INT,
PRIMARY KEY (assignment_id),
FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
FOREIGN KEY (task_id) REFERENCES Task(id) ON DELETE CASCADE
);

/*/////////////////////////////////////////////////////////////*/

/*Test entries/format for inserting new entires into database*/

INSERT INTO User VALUES (001,'firstname','lastname','2000/02/02','username','password','test@example.com',0);
INSERT INTO Profile VALUES (1,'linktopicture.jpg','this is my bio','position','education','mon-fri, 9-5');
INSERT INTO Task VALUES (001,'taskname','short description','long description long description long description','2020/6/3','2021/6/3');
INSERT INTO Assignments VALUES (123,001,001);

/*//////////////////////////////////////////////////////////////

/*Queries*/
/*{} represents a variable that will be taken from a post request*/

/*find information of all tasks assinged to a user with id {1}. Used for the home page*/
SELECT * from Task WHERE id = (SELECT task_id from Assignments WHERE user_id=1);

/*(just selects name)*/
SELECT name from Task INNER JOIN Assignments ON Task.id = Assignments.task_id WHERE Assignments.user_id = 1;


/*find all (first name of) users assigned to a task with id {1}. Used for creating groups on group page*/
SELECT first_name from User WHERE id = (SELECT user_id from Assignments WHERE task_id=1);


/*finds all current users in system. Used for showing all people on group page*/
SELECT first_name, last_name from User;


/*finds a user with id {1} profiles information. Used to construct the profile of the user*/
SELECT * from Profile WHERE profile_id = 1;


/*update a user with id {1} profile. Used when a user updates their profile*/
UPDATE Profile SET bio='this is my second bio' WHERE profile_id=1;