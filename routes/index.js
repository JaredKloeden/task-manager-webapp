var express = require('express');
var router = express.Router();
var path = require("path");
const argon2 = require('argon2');
const {OAuth2Client} = require('google-auth-library');
const CLIENTID='335947766900-g7sam2plsiq165hq68d3d9oa1q8lralc.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENTID);
var sanitizeHtml = require('sanitize-html');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/../public/login.html'));
});

router.get('/login', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/../public/login.html'));
});

router.post('/login_auth', async function(req, res) {

    //NOTE: Validation error seems to be a mistaken error from using google API

    var uname=sanitizeHtml(req.body.user);

    //Connect to the database
    req.pool.getConnection(function(err,connection) {
        if (err) {
            console.log(err.message);
            res.sendStatus(500);
            return;
        }

    const query = "SELECT password, privleges from User WHERE username = ?;";
    connection.query(query, [uname], async function(err, rows, fields) {
        connection.release(); // release connection
        if (err) {
            console.log(err.message);
            res.sendStatus(500);
            return;
        }

        if (rows[0]==undefined){
            console.log("no matching username");
            res.sendStatus(401);
            return;
        }

        try {
        if (await argon2.verify(rows[0].password, req.body.pass)) {
         // password match
         // add code here for when user successfully logged in
            req.session.user=uname;
            if (rows[0].privleges==1){
                console.log("manager detected");
                req.session.manage=1;
            }
            console.log("found account");
            res.sendStatus(200);
        } else {
            // password did not match
            // add code here for when user login fails
            console.log("incorrect password");
            res.sendStatus(401);
         return;
         }
        } catch (err) {
        // internal failure
         res.sendStatus(500);
        return;
        }

        });
    });
});

router.get('/create_account', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/../public/create_account.html'));
});

router.post('/create_account_auth', async function(req, res, next) {
    var uname=sanitizeHtml(req.body.username);
    var fname=sanitizeHtml(req.body.first_name);
    var lname=sanitizeHtml(req.body.last_name);
    var dob=sanitizeHtml(req.body.date_of_birth);
    var eemail=sanitizeHtml(req.body.email);

    var phash = null;
    try {
    phash = await argon2.hash(sanitizeHtml(req.body.password));

    //Connect to the database
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }

    var id = Math.floor(Math.random() * 1000000);

    var query = "INSERT INTO User VALUES (?, ?, ?, ?, ?, ?, ?, 0)";
    connection.query(query, [id,fname,lname,dob,uname,phash,eemail], function(err, rows, fields) {
        if (err) {
            console.log(err.message);
            res.sendStatus(401);
            return;
        }else{

            var query = "INSERT INTO Profile VALUES (?, 'default.jpg', 'update your bio', 'update your position', 'update your hobbies', 'update your education', 'update your availability');";
            connection.query(query, [id], function(err, rows, fields) {
            connection.release(); // release connection
            if (err) {
            console.log(err.message);
            res.sendStatus(401);
            return;
            }else{
            console.log("created new account");
            res.sendStatus(200);
            }
            });
            }
        });
    });
    } catch (err) {
    res.sendStatus(500);
    return;
    }
});

router.post('/tokensignin', async function(req, res, next) {

      const ticket = await client.verifyIdToken({
          idToken: req.body.idtoken,
          audience: CLIENTID,  // Specify the CLIENT_ID of the app that accesses the backend
          // Or, if multiple clients access the backend:
          //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
          });
          const payload = ticket.getPayload();
          const userid = payload['sub'];
          const email = payload['email'];
          // If request specified a G Suite domain:
          // const domain = payload['hd'];

          //Connect to the database
            req.pool.getConnection(function(err,connection) {
                if (err) {
                    res.sendStatus(500);
                    return;
                }

            var query = "SELECT * FROM User WHERE email=?;";
            connection.query(query, [email], function(err, rows, fields) {
                connection.release(); // release connection
                if (err) {
                    console.log(err.message);
                    res.sendStatus(401);
                    return;
                }else if (rows[0]==undefined){
                    console.log("no matching account");
                    res.sendStatus(401);
                    return;
                }else{
                    console.log("token sign in success!");
                    req.session.user=rows[0].username;
                    if (rows[0].privleges==1){
                    req.session.manage=1;
                    }
                    res.sendStatus(200);
                }

        });
    });
});

router.use(function(req, res, next) {
    if (!('user' in req.session)){
        res.sendFile(path.join(__dirname+'/../public/index.html'));
        return;
    }
    next();
});

router.get('/home', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/../public/home.html'));
});

router.get('/profile/:username', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/../public/profile.html'));
});

router.get('/todo', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/../public/todo.html'));
});

router.get('/groups', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/../public/groups.html'));
});

router.get('/notifications', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/../public/notifications.html'));
});

router.get('/manage', function(req, res, next) {
    if (!('manage' in req.session)){
        res.sendStatus(403);
        return;
    }
    res.sendFile(path.join(__dirname+'/../public/manage.html'));
});

router.get('/logout', function(req, res, next) {
    delete req.session.user;
    delete req.session.manage;
    res.sendStatus(200);
});

/////////////////////////////////////////////////////////////


router.post('/editprofile', function(req, res, next) {

    var bio = sanitizeHtml(req.body.bio);
    var education = sanitizeHtml(req.body.education);
    var hobbies = sanitizeHtml(req.body.hobbies);
    var availability = sanitizeHtml(req.body.availability);
    var user = sanitizeHtml(req.session.user);

    //Connect to the database
        req.pool.getConnection(function(err,connection) {
            if (err) {
                console.log(err.message);
                res.sendStatus(500);
                return;
            }

        const query = "UPDATE Profile INNER JOIN User ON User.id=Profile.profile_id SET bio=?, education=?, hobbies=?, availability=? WHERE User.username=?;";
        connection.query(query, [bio,education,hobbies,availability,user], async function(err, rows, fields) {
            connection.release(); // release connection
            if (err) {
                console.log(err.message);
                res.sendStatus(500);
                return;
                }
                console.log("updated profile");
                res.sendStatus(200);
        });
    });

});

router.post('/createpost', function(req, res, next) {

    var len=req.body.people.people.length;

    var tname=sanitizeHtml(req.body.details.task_name);
    var sdesc=sanitizeHtml(req.body.details.short_description);
    var ldesc=sanitizeHtml(req.body.details.long_description);

    var d = new Date();
    var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()
    var ddate=req.body.details.due_date;

    var fail=0;
    //Connect to the database
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
    var id = Math.floor(Math.random() * 1000000);

    var query = "INSERT INTO Task VALUES (?, ?, ?, ?, ?, ?, 0)";
    connection.query(query, [id,tname,sdesc,ldesc,date,ddate], function(err, rows, fields) {
        //connection.release(); // release connection
        if (err) {
            console.log(err.message);
            res.sendStatus(401);
            return;
        }else{
            console.log("task create success!");

                        for (var i=0; i<len; i++){

                        var id2 = Math.floor(Math.random() * 1000000);

                        var user_id=parseInt(req.body.people.people[i]);


                        var query = "INSERT INTO Assignments VALUES (?, ?, ?)";
                        connection.query(query, [id2,user_id,id], function(err, rows, fields) {
                        //connection.release(); // release connection
                        if (err) {
                            console.log(err.message);
                            fail=1;
                            i=len;
                            res.sendStatus(401);
                            return;
                        }else{
                            console.log("assignment creation success!");

                        }

                        });

                }
                connection.release();
            }
            if (fail==0){
                    res.sendStatus(200);
                }

        });
    });

});

router.get('/hometasks', function(req, res, next) {

    //Connect to the database
    req.pool.getConnection(function(err,connection) {
        if (err) {
            console.log(err.message);
            res.sendStatus(500);
            return;
        }

    const query = "SELECT name, short_description, long_description, due_date from Task inner join Assignments on Task.id=Assignments.task_id inner join User on User.id=Assignments.user_id WHERE User.username = ?;";
    connection.query(query, [req.session.user], async function(err, rows, fields) {
        connection.release(); // release connection
        if (err) {
            console.log(err.message);
            res.sendStatus(500);
            return;
            }
            console.log("found tasks");
            res.json(rows);
        });
    });
});

router.get('/groups_people', function(req, res, next) {

    var data = [];
    var assignments = [];

    //Connect to the database
    req.pool.getConnection(function(err,connection) {
        if (err) {
            console.log(err.message);
            res.sendStatus(500);
            return;
        }

    var query = "SELECT * from Task;";
    connection.query(query, function(err, rows3, fields) {
        if (err) {
            console.log(err.message);
            res.sendStatus(500);
            return;
            }
            data.push(rows3);

        var query = "SELECT * from User;";
        connection.query(query, function(err, rows2, fields) {
            if (err) {
                console.log(err.message);
                res.sendStatus(500);
                return;
                }

                data.push(rows2);

                const len = parseInt(data[0].length);
                const limit = len-1;
                var fail = 0;
                var final = 0;
                var i = 0;
                var k = 0;

                for (i=0; i<len; i++) {

                    var query = "SELECT first_name, last_name from User inner join Assignments on User.id=Assignments.user_id inner join Task on Assignments.task_id=Task.id WHERE Task.id =?;";
                    connection.query(query, [data[0][i].id], function(err, rows, fields) {
                    if (err) {
                        console.log(err.message);
                        fail=1;
                        i=len;
                        res.sendStatus(500);
                        return;
                        }

                        assignments.push(rows);
                        k++;

                        if (k==len){
                            i=len;
                            data.push(assignments);
                            connection.release();
                            console.log("success!");
                            res.json(data);

                        }
                    });
                }
            });
        });//
    });//
});

router.get('/manage_users', function(req, res, next) {

    var data=[];

    //Connect to the database
    req.pool.getConnection(function(err,connection) {
        if (err) {
            console.log(err.message);
            res.sendStatus(500);
            return;
        }

    var query = "SELECT first_name, last_name, id from User;";
    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.log(err.message);
            res.sendStatus(500);
            return;
            }

            data.push(rows);

            var query2 = "SELECT * from Task WHERE progress = 1;";
            connection.query(query2, function(err, rows2, fields) {
            connection.release(); // release connection
            if (err) {
            console.log(err.message);
            res.sendStatus(500);
            return;
            }
                data.push(rows2);
                res.json(data);
            });
        });
    });
});

router.get('/todo_tasks', function(req, res, next) {

    var user = req.session.user;

    //Connect to the database
    req.pool.getConnection(function(err,connection) {
        if (err) {
            console.log(err.message);
            res.sendStatus(500);
            return;
        }

    const query = "SELECT name, long_description, due_date, Task.id, progress from Task inner join Assignments on Task.id=Assignments.task_id inner join User on User.id=Assignments.user_id WHERE User.username = ?;";
    connection.query(query, [user], async function(err, rows, fields) {
        connection.release(); // release connection
        if (err) {
            console.log(err.message);
            res.sendStatus(500);
            return;
            }
            console.log("found tasks");
            res.json(rows);
        });
    });
});

router.post('/mark_complete', function(req, res, next) {

    var task_id = req.body.id;

    //Connect to the database
    req.pool.getConnection(function(err,connection) {
        if (err) {
            console.log(err.message);
            res.sendStatus(500);
            return;
        }

    const query = "UPDATE Task SET progress = 1 WHERE id =?;";
    connection.query(query, [task_id], async function(err, rows, fields) {
        connection.release(); // release connection
        if (err) {
            console.log(err.message);
            res.sendStatus(500);
            return;
            }
            console.log("set completed")
            res.sendStatus(200);
        });
    });
});

router.post('/unmark_complete', function(req, res, next) {

    var task_id = req.body.id;

    //Connect to the database
    req.pool.getConnection(function(err,connection) {
        if (err) {
            console.log(err.message);
            res.sendStatus(500);
            return;
        }

    const query = "UPDATE Task SET progress = 0 WHERE id =?;";
    connection.query(query, [task_id], async function(err, rows, fields) {
        connection.release(); // release connection
        if (err) {
            console.log(err.message);
            res.sendStatus(500);
            return;
            }
            console.log("set uncompleted")
            res.sendStatus(200);
        });
    });

});

router.post('/delete_post', function(req, res, next) {

        var task_id = req.body.id;

        //Connect to the database
        req.pool.getConnection(function(err,connection) {
            if (err) {
                console.log(err.message);
                res.sendStatus(500);
                return;
            }

        const query = "DELETE FROM Task WHERE id = ?;";
        connection.query(query, [task_id], async function(err, rows, fields) {
            connection.release(); // release connection
            if (err) {
                console.log(err.message);
                res.sendStatus(500);
                return;
                }
                console.log("deleted task");
                res.sendStatus(200);
        });
    });
});

router.get('/current_user', function(req, res, next) {
    res.send(req.session.user);
});

router.get('/profile_data/:user', function(req, res, next) {

    var current_user = req.session.user;
    var user = req.params.user;
    var data = [];

    data.push(current_user);

    //Connect to the database
        req.pool.getConnection(function(err,connection) {
            if (err) {
                console.log(err.message);
                res.sendStatus(500);
                return;
            }

        const query = "SELECT * from User inner join Profile on User.id=Profile.profile_id WHERE User.username=?;";
        connection.query(query, [user], async function(err, rows, fields) {
            connection.release(); // release connection
            if (err) {
                console.log(err.message);
                res.sendStatus(500);
                return;
                }
                console.log("found user data");
                data.push(rows);
                res.send(data);
        });
    });
});

router.get('/is_manager', function(req, res, next) {

        var current_user = req.session.user;

     //Connect to the database
        req.pool.getConnection(function(err,connection) {
            if (err) {
                console.log(err.message);
                res.sendStatus(500);
                return;
            }

        const query = "SELECT privleges from User where username =?;";
        connection.query(query, [current_user], async function(err, rows, fields) {
            connection.release(); // release connection
            if (err) {
                console.log(err.message);
                res.sendStatus(500);
                return;
                }
                if (rows[0].privleges==1){
                    res.sendStatus(200);
                }else{
                    res.sendStatus(403);
                }
        });
    });

});

module.exports = router;