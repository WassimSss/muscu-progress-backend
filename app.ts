require('dotenv').config();
require('./models/connection');
import express from 'express';
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');



// var indexRouter = require('./routes/index');
var indexRouter = require('./routes/index');
var exercisesRouter = require('./routes/users/exercises');
var muscleGroupsRouter = require('./routes/users/muscle-groups');
var workoutsRouter = require('./routes/users/workouts');
var weightsRouter = require('./routes/users/weights')
var apiRouter = require('./routes/api');
var adminRouter = require('./routes/admin/data-app');


var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/users/exercises', exercisesRouter);
app.use('/users/muscle-groups', muscleGroupsRouter);
app.use('/users/workouts', workoutsRouter);
app.use('/users/weights', weightsRouter);
app.use('/admin/data-app', adminRouter);



module.exports = app;


