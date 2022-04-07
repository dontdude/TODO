"use strict"

const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.set('views', __dirname + '/views');  //setting 'views' directory for any views

app.use(bodyParser.urlencoded({extended:true}));
app.use("/public", express.static(__dirname + "/public"));

let items = [];

app.get("/", function(req, res){

    let day = date.day();
    let noon = date.noon();
    
    res.render('list', {
      daykind: day, 
      noonkind: noon,
      listitems: items
    });   // sending multiple objects to ejs file 
});

app.get("/about", function(req, res){
    res.render("about");
});

app.post("/", function(req, res){
   
    let item = req.body.newitem;
    items.push(item);

    res.redirect("/");
});

app.post("/reset", function(req, res){
    items = [];

    res.redirect("/");
})

app.listen(3000, function(){
   console.log("Server is running on port 3000");
});

