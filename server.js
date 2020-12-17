const express = require('express'),
  path = require('path'),
  dotenv = require('dotenv'),
  app = express(),
  morgan =require('morgan'),
  colors = require('colors'),
  errorHandler = require('./middleware/error'),
  PORT = process.env.PORT || 5000;



//load env vars
dotenv.config({ path: './config/config.env' });
app.set('view engine', 'ejs');
//Body parser
app.use(express.json());

//the next set of declarations 
const routes = require('./routes/routes'),
  payRoutes = require('./routes/payRoutes'),
  connectDB = require('./config/db'); //connecting the database

connectDB(); 

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);  //mounting routes
app.use('/pay', payRoutes);
app.use(errorHandler); 



//dev logging middleware
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

const server = app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

//handle unhandled rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('unhandledRejection', err.message);
  //close server & exit process
  server.close();
});

//handling crashes
process.on('uncaughtException', (err, promise) => {
  console.log('uncaughtException', err.message);
  //close server & exit process
  server.close();
});

//killing server
process.on('SIGTERM', (err, promise) => {
  console.log('SIGTERM', err.message);
  //close server & exit process
  server.close();
});
