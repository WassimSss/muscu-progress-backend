require('dotenv').config();
require('./models/connection');
import express from 'express';
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


// var indexRouter = require('./routes/index');
var indexRouter = require('./routes/index');
var exercisesRouter = require('./routes/users/exercises');
var muscleGroupsRouter = require('./routes/users/muscle-groups');
var workoutsRouter = require('./routes/users/workouts');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users/exercises', exercisesRouter);
app.use('/users/muscle-groups', muscleGroupsRouter);
app.use('/users/workouts', workoutsRouter);



module.exports = app;


