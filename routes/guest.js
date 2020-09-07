var  express = require('express');
var ejs = require('ejs');
var fs =require('fs');
var connection = require('./connection');
var app = express();


require('json-response');

app.get('/add', function(req, res) {
	connection.query('SELECT sname FROM sports',function(err, rows, fields) {
		//if(err) throw err
		if (err) {
		  //req.flash('error', err)
		  res.send(err);
		} else {
		  // render to views/user/list.ejs template file
		  console.log(rows);
		  res.render('user/guest', {
			data: rows
		  })
	
		}
	  })
});
var game;

app.post('/add', function(request, response) {
	
	var name = request.body.username;
	game = request.body.sports;
	var	date = request.body.date ;
	var	fromTime = request.body.start_time;
	var	endTime = request.body.end_time;
	var	phone = request.body.phone;

		
	var sql = "INSERT INTO users (username,usergame,userdate,userfromtime ,userendtime,userphone) VALUES ('"+name+"','"+game+"','"+date+"','"+fromTime+"','"+endTime+"','"+phone+"')" ;
	connection.query(sql,function(err, result) {
		if(err) response.send(err);
		else{
			console.log("Data Added Successfully!");
			response.redirect('/guest/pay');
		}
		

	});	
});


app.get('/pay', function(req, res) {
		
	connection.query('SELECT guestprice FROM sports Where sname=?',[game],function(err, rows, fields) {
		//if(err) throw err
		if (err) {
		  //req.flash('error', err)
		  res.send(err);
		} else {
		  // render to views/user/list.ejs template file
		  console.log(rows);
		  res.render('user/payment1', {
			title:"umesh",
			data: rows,
			game:game
		  })
	
		}
	  })

});

app.post('/pay', function(request, response) {
  
    response.redirect('/guest/invoice');
  
});


app.get('/invoice', function(request, response) {
	response.render('user/home')
});

module.exports = app;