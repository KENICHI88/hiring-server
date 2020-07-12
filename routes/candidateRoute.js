import express from 'express';
import multer from 'multer';

const route = express.Router();

import {getList, getCountList, getOne, create, deleteOne, update} from '../controllers/candidate.controller';

const diskStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads');
  },
  filename: (req, file, callback) => {
    let match = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if(match.indexOf(file.mimetype) === -1) {
      let errorMess = `The file upload is invalid`;
      return callback(errorMess, null);
    }
    const date = new Date();
    const prefix = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}-${Math.random().toString().substr(2,8)}`;
    let filename = `${prefix}-cv-${file.originalname.replace(/_/g, '')}`;
    callback(null, filename);
  }
});

let uploadFile = multer({storage: diskStorage});

route
  .get('/getlist', getList)
  .get('/getCountList', getCountList)
  .get('/getone/:id',  getOne)
  .post('/saveone', uploadFile.single('cv_file') , create)
  .post('/updateone', uploadFile.single('cv_file'), update)
  .post('/updateoneWithoutFile', update)
  .delete('/delete/:id', deleteOne)
  
module.exports = route;
