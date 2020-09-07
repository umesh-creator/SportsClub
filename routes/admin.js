var  express = require('express');
var fs =require('fs');
var connection = require('./connection');
var app = express();

app.get('/add', function(request, response) {
	
	response.render('user/admin')
});

app.get('/home', function(request, response) {
	response.render('user/adminhome')
});

app.post('/add', function(request, response) {

	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM admins WHERE Email = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect("/admin/home");
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

// SHOW ADD USER FORM
app.get('/addsports', function(req, res, next){	
	// render to views/user/add.ejs
	res.render('user/addsports', {
		title: 'Add New Sports',
		sname: '',
		userprice: '',
		guestprice: ''		
	})
})

// ADD NEW Sports POST ACTION
app.post('/addsports', function(req, res, next){

	var sports = {
		sname: req.body.sname,
		userprice: req.body.userprice,
		guestprice: req.body.guestprice
	}
	
	connection.query('INSERT INTO sports SET ?', sports, function(err, result) {
		//if(err) throw err
		if (err) {
			//req.flash('error', err)
			// render to views/user/add.ejs
			res.render('user/addsports', {
				title: 'Add New Sports',
				sname: user.sname,
				userprice: user.userprice,
				guestprice: user.guestprice					
			})
		} else {				
			//req.flash('success', 'Data added successfully!')
			// render to views/user/add.ejs
			res.render('user/adminhome')
		}
	})
})


// DELETE USER
app.delete('/listsports/delete/:id', function(req, res, next) {
	connection.query('DELETE FROM sports WHERE id = ?' , [req.param.id], function(err, result) {
		//if(err) throw err
		if (err) {
			res.send(err);
			//req.flash('error', err)
			// redirect to users list page
			res.redirect('/admin/home')
		} else {
			//req.flash('success', 'Sport deleted successfully! sname = ' + req.params.sname)
			// redirect to users list page
			console.log(req.param.id);
			res.redirect('/admin/listsports')
		}
	})
		
})



/*
app.post('/sports', function(request, response) {
	
	var sname = request.body.sportsname;
	var user = request.body.userprice;
	var	guest = request.body.guestprice ;
	

		
	var sql = "INSERT INTO sports (sname,userprice,guestprice) VALUES ('"+sname+"','"+user+"','"+guest+"')" ;
	connection.query(sql,function(err, result) {
		if(err) //request.flash(err)
		response.send(err)
		else{
			//request.flash('success', 'Data added successfully!')
			response.redirect('/admin/home');
		}
		

	});	
});
*/



app.get('/listusers', function(req, res, next) {
	connection.query('SELECT * FROM users ORDER BY userdate ASC',function(err, rows, fields) {
		//if(err) throw err
		if (err) {
			//req.flash('error', err)
			res.render('user/list', {
				title: 'User List', 
				data: ''
			})
		} else {
			// render to views/user/list.ejs template file
			res.render('user/list', {
				title: 'User List', 
				data: rows
			})

		}
	})	
	
})

app.get('/listsports', function(req, res, next) {
	connection.query('SELECT * FROM sports',function(err, rows, fields) {
		//if(err) throw err
		if (err) {
			//req.flash('error', err)
			res.render('user/listsports', {
				title: 'Sport List', 
				data: ''
			})
		} else {
			// render to views/user/list.ejs template file
			res.render('user/listsports', {
				title: 'Sport List', 
				data: rows
			})

		}
	})	
	
})


module.exports = app;