var express = require("express");
var http = require("http");
var path = require("path");
var exphbs = require('express-handlebars');
var support =require("./model/model.js"); // Get model function
const expressSession = require('express-session'); // Get the session handling middleware for express
const session = require("express-session");
const { nextTick } = require("process");
const { captureRejectionSymbol } = require("events");

// Construct the actual express object 
var app= express();

// Set up handlebars
var handlebars = exphbs.create({defaultLayout: 'main'});
app.engine('.handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static('views'));

// Set its properties
app.use(expressSession(
    {
        resave: false,
        saveUninitialized: false,
        secret: "abcd1234EFGH", // Secret key to sign session ID
        cookie: {maxAge: 600000} // Session exprires in 600,000 ms (10 minutes)

    }
));

// When home page requested initially load first page into session
app.get("/", function(request, response)
{
    if (!request.session.Award_list) { 
        request.session.Award_list = support.get_Award_list();  
    }
    response.render("firstpage");
});


app.get("/Award_List", function(request,response)
{ 
response.render("Award_List",{Award_List:request.session.Award_list});
});


app.get("/Search_Awards", function(request,response)
{ 
   
    response.render("Search_Awards",{Search_Awards:request.session.Award_list});
});




// for error handling
app.use(function(request, response) {
    response.render("404");
});

app.use(function(err, request, response, next) {
    console.log(err);
    response.writeHead(500, {'Content-Type': 'text/html'});
    response.end('<html><body><h2>Server error!</h2></body></html>');
    next();
});


// Have the app listen at port 3000
http.createServer(app).listen(3000);
{
    //console.log("server started");
}
