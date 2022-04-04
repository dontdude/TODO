"use strict"

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');

app.set('views', __dirname + '/views');  //setting 'views' directory for any views

app.get("/", function(req, res){
   
    var today = new Date();
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    var day = days[today.getDay()];  
    var hour = today.getHours();
    var noon = "Morning";
    
    if(hour >= 5 && hour <= 12)  noon = "Morning";
    else if(hour >= 13 && hour <= 17)  noon = "Afternoon";
    else if(hour >= 18 && hour <= 19)  noon = "Evening";
    else noon = "Night";
    
    res.render('list', {
      daykind: day, 
      noonkind: noon
    });   // sending multiple objects to ejs file 
});

app.listen(3000, function(){
   console.log("Server is running on port 3000");
});

