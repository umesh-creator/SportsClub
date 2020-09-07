var express = require('express');
var router = express.Router();
var connection = require('./connection');
var User = require('../models/user');



// GET route for reading data
router.get('/', function (req, res, next) {
  return res.render('index', {title: 'My Node.js Application'})
});

var mememail;
var memname;

//POST route for updating data
router.post('/', function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {
      
     var  email1= req.body.email;
     var username1 = req.body.username;
     var  password1 = req.body.password;

     var userData = {
      email: email1,
      username: username1,
      password: password1,
     }

        var sql = "INSERT INTO members (mememail,memname,mempassword) VALUES ('"+email1+"','"+username1+"','"+password1+"')" ;
        connection.query(sql,function(err, result) {
        if(err) console.log(err);
        else{
          console.log("Data Added Successfully!");
        
        }});

        User.create(userData, function (error, user) {
          if (error) {
            return next(error);
          } else {
            req.session.userId = user._id;
            req.session.username=user.username;
            memname=req.session.username;
            mememail=email1;
            return res.redirect('/profile');
          }
        });

    } else if (req.body.logemail && req.body.logpassword) {
      User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
        if (error || !user) {
          var err = new Error('Wrong email or password.');
          err.status = 401;
          return next(err);
        } else {
          req.session.userId = user._id;
          req.session.username=user.username;
          console.log(req.session.username);
          memname=req.session.username;
          mememail=req.body.logemail;
          return res.redirect('/profile');
        }
      });
    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
  })

// GET route after registering
router.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          connection.query('SELECT sname FROM sports',function(err, rows, fields) {
            //if(err) throw err
            if (err) {
              //req.flash('error', err)
              res.send(err);
            } else {
              // render to views/user/list.ejs template file
              console.log(rows);
              res.render('user/user', {
                data: rows
              })
        
            }
          })
        }
      }
    });
});
var game;
var sql1;

router.post('/use', function(request, response) {
	
	
	var name = memname;
  game = request.body.sports;
  console.log(game);
  var	date = request.body.date ;
	var	fromTime = request.body.start_time;
	var	endTime = request.body.end_time;
  var	phone = request.body.phone;
  var memEmail = mememail;
  sql1 = "INSERT INTO users (username,usergame,userdate,userfromtime ,userendtime,userphone,memEmail) VALUES ('"+name+"','"+game+"','"+date+"','"+fromTime+"','"+endTime+"','"+phone+"','"+memEmail+"')" ;
  response.redirect('/pay');

});

router.get('/pay', function(req, res) {
  
  connection.query(sql1,function(err, result) {
    if(err) res.send(err);
    else{
      console.log("Data Added Successfully!");
    }
  })
  connection.query('SELECT userprice FROM sports Where sname=?',[game],function(err, rows, fields) {
		//if(err) throw err
		if (err) {
		  //req.flash('error', err)
		  res.send(err);
		} else {
		  // render to views/user/list.ejs template file
		  console.log(rows);
		  res.render('user/payment', {
			title:"Payment",
			data: rows,
			game:game
		  })
	
		}
	  })
        
});
// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

router.post('/pay', function(request, response) {
 
    response.redirect('/invoice');

});


router.get('/invoice', function(request, response) {
  response.render('user/home')
});

module.exports = router;