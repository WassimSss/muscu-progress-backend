require('dotenv').config();
require('./models/connection');
import express from 'express';
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var exercisesRouter = require('./routes/users/exercises');
var muscleGroupsRouter = require('./routes/users/muscle-groups');
var workoutsRouter = require('./routes/users/workouts');
var weightsRouter = require('./routes/users/weights');
var caloriesRouter = require('./routes/users/calories');
var programRouter = require('./routes/users/programs');
var apiRouter = require('./routes/api');
var adminRouter = require('./routes/admin/data-app');

var app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',');

console.log(allowedOrigins);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins?.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`Origin ${origin} not allowed by CORS`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

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
app.use('/users/calories', caloriesRouter);
app.use('/users/programs', programRouter);
app.use('/admin/data-app', adminRouter);

module.exports = app;
