const mysql = require("mysql");

var connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "password",
    database : "sportsclub",
    multipleStatements : true

});

connection.connect((err)=>{

    if(err)
    {
        console.log(err);
    }


    else{
        console.log("Connected to MySql !!");
    }
})

module.exports = connection;