"use strict"

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require("lodash");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.set('views', __dirname + '/views');  //setting 'views' directory for any views

app.use(bodyParser.urlencoded({extended:true}));
app.use("/public", express.static(__dirname + "/public"));

mongoose.connect("mongodb+srv://dontdude:UJ3myodacQna3lXQ@cluster0.8gasx.mongodb.net/todoDB");

const taskSchema = new mongoose.Schema({
    name : String
});

const Task = mongoose.model("Task", taskSchema);

const task1 = new Task({
    name : "Welcome to your ToDo List."
});
const task2 = new Task({
    name : "Hit + to enter new task."
});
const task3 = new Task({
    name : "Hit checkbox to delete a task."
});

const defaultTask = [task1, task2, task3];

const listSchema = {
    name : String, 
    tasks : [taskSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res){

    let day = date.day();
    let noon = date.noon();

    Task.find({}, function(err, foundTask){
        if(foundTask.length == 0){
            Task.insertMany(defaultTask, function(err){
                if(!err){
                    console.log("Successfully saved default tasks to DB"); 
                    res.redirect("/");   
                }
            });
        } else {
            res.render('list', {
                title: day, 
                noon: noon,
                tasklist: foundTask
            });
        }
    }); 
});

app.get("/:customListName", function(req, res){

    const customListName = _.capitalize(req.params.customListName);
    
    List.findOne({name : customListName}, function(err, foundList){
        if(!err){
            if(!foundList){
                const list = new List({
                    name : customListName,
                    tasks : defaultTask
                });
                list.save();
                res.redirect("/" + customListName);  
            } else {
                res.render('list',{
                    title : foundList.name,
                    noon : "custom",
                    tasklist : foundList.tasks
                });
            }
        }
    });
});

app.get("/about", function(req, res){
    res.render("about");
});

app.post("/", function(req, res){
    
    const taskname = req.body.newtask;
    const listname = req.body.list;

    const newTask = new Task({
        name : taskname
    });
    
    if(listname == date.day()){
        newTask.save();
        res.redirect("/");
    } else {
        List.findOne({name : listname}, function(err, foundList){
            foundList.tasks.push(newTask);
            foundList.save();
            res.redirect("/" + listname);
        });
    }
});

app.post("/delete", function(req, res){
    
    const checkedTask = req.body.deleteTask;
    const listname = req.body.list;

    if(listname == date.day()){
        Task.findByIdAndRemove(checkedTask, function(err){
            if(!err){
                console.log("Successfully deleted checked Task");
                res.redirect("/");
            }
        });
    } else {
        List.findOneAndUpdate({name: listname}, {$pull: {tasks: {_id: checkedTask}}}, function(err, foundList){
            if(!err){
                res.redirect("/" + listname);
            }
        });
    }
});

app.post("/reset", function(req, res){
   
    const listname = req.body.resetTasks;
    
    if(listname == date.day()){
        Task.deleteMany({}, function(err){
            if(!err){
                console.log("All task in DB cleared")
            }
        });
        res.redirect("/");
    } else {
        List.deleteMany({}, function(err){
            if(!err){
                console.log("All task in DB cleared")
            }
        });
        res.redirect("/" + listname);
    }
});

app.listen(process.env.PORT || 3000, function(){
   console.log("Server is running on port 3000");
});

