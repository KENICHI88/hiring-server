import express from 'express';
// import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8010;
//////////////
import {checkToken} from './helpers/helpers';

/////////////// Version 1 ///////////////

// import indexRouter from './routes/indexRoute';
// import roleRouter from './routes/roleRoute';
// import userRouter from './routes/userRoute';
// import candidateRouter from './routes/candidateRoute';
// import fileRouter from './routes/fileRoute';
// import scheduleBusy from './routes/scheduleBusy';
// import scheduleInterview from './routes/scheduleInterview';

/////////////// end Version 1 ///////////////
import roleRouter from './routes/v2/roleRoute';
import teamRouter from './routes/v2/teamRoute';
import permissionRouter from './routes/v2/permissionRoute';
import offerRouter from './routes/v2/offerRoute';
import userRouter from './routes/v2/userRoute';
import interviewRouter from './routes/v2/interviewRoute';
import fileRouter from './routes/v2/fileRoute';
/////////////// Version 2 ///////////////
/////////////// end Version 2 ///////////////
//////////////
import connectDB from './db/connect';
//////////////

app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// app.use('*', checkToken);

/////////////// Version 1 ///////////////
// app.use('/role', roleRouter);
// app.use('/user', userRouter);
// app.use('/candidate', candidateRouter);
// app.use('/file', fileRouter);
// app.use('/scheduleBusy', scheduleBusy);
// app.use('/scheduleInterview', scheduleInterview);
/////////////// end Version 1 ///////////////


/////////////// Version 2 ///////////////
app.use('/role', roleRouter);
app.use('/team', teamRouter);
app.use('/permission', permissionRouter);
app.use('/offer', offerRouter);
app.use('/interview', interviewRouter);
app.use('/user', userRouter);
app.use('/file', fileRouter);
/////////////// end Version 2 ///////////////

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.json({message: err});
});

app.listen(port, () => {
  console.log(`Nodejs server is running on port ${port}`);
})
