import express from 'express';
const app =express();
import dotenv from 'dotenv';
import connectDB from "./db/mongoose.js";

dotenv.config();

//import Routes
import {AdminRouter} from './routes/admin.route.js';

//connect to DB
connectDB();

//middleware
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, OPTIONS, PATCH"
  );
  next();
});

//Route middleware
app.use(AdminRouter)

//app.use('/api/posts',postRoute);

const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log("Server up and running available at http://localhost:" + port)
);

app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
  
});
