import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
// const mongoDB = 'mongodb+srv:/ /superadmin:superadmin@hiring-app-dlufr.gcp.mongodb.net/hiring_app?retryWrites=true&w=majority';
mongoose.set('useFindAndModify', false);
//Version 1
// const mongoDB = 'mongodb+srv://superadmin:superadmin@hiring-app-dlufr.gcp.mongodb.net/hiring_app?retryWrites=true&w=majority';

// Version 2
const mongoDB = 'mongodb+srv://superuser:superuser@hrms-fnqw5.gcp.mongodb.net/hrms?retryWrites=true&w=majority';

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true, });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB Cloude connection error'));
