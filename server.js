const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

mongoose.connect('mongodb://davidtauch:PzEFFLuA1C9hqzA2@todo-shard-00-00-ohbkf.mongodb.net:27017,todo-shard-00-01-ohbkf.mongodb.net:27017,todo-shard-00-02-ohbkf.mongodb.net:27017/Todo?ssl=true&replicaSet=Todo-shard-0&authSource=admin');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

const schema = mongoose.Schema({
    text: String,
    completed: Boolean
});

const Todo = mongoose.model('Todo', schema);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB");
});

app.get('/', function(req,res) {
    res.render('./public/index.html');
});

app.listen(8080);
console.log("App listening on port 8080");

app.get('/api/todos', function(req, res) {
    Todo.find(function(err, todos) {
        if (err) {
            res.send(err)
        }
        res.json(todos);
    });
});

app.post('/api/todos', function(req, res) {
    Todo.create({
        text : req.body.text,
        completed : false
    }, function(err, todo) {
        if (err) {
            res.send(err);
        }

        Todo.find(function(err, todos) {
            if (err) {
                res.send(err)
            }
            res.json(todos);
        });
    });

});
app.put('/api/todos/edit/:todo_id/:text', function(req, res) {
    Todo.update({_id : req.params.todo_id}, {text: text}, function(err, todo) {
        if (err) {
            res.send(err);
        }
        Todo.find(function(err, todos) {
            if (err){
                res.send(err)
            }
            res.json(todos);
        });
    });
});

app.put('/api/todos/:todo_id/:completed', function(req, res) {
    Todo.update({_id : req.params.todo_id}, {completed: req.params.completed}, function(err, todo) {
        if (err) {
            res.send(err);
        }
        Todo.find(function(err, todos) {
            if (err){
                res.send(err)
            }
            res.json(todos);
        });
    });
});

app.delete('/api/todos/delete/:todo_id', function(req, res) {
    Todo.remove({_id : req.params.todo_id}, function(err, todo) {
        if (err) {
            res.send(err);
        }
        Todo.find(function(err, todos) {
            if (err){
                res.send(err)
            }
            res.json(todos);
        });
    });
});
