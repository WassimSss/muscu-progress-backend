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

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',');
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins?.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200 // Pour certains navigateurs qui posent problème (IE11, certains SmartTV)
};

app.use(cors(corsOptions));

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


