import express from 'express';
///////
import {
  getList,
  getDetail,
  save,
  update,
  uploadFile,
  readFile,
} from '../../controllers/v2/file.controller';

const route = express.Router();

route
  .get('/getList',  getList)
  .get('/getDetail/:id', getDetail)
  .post('/postDetail/', uploadFile.single('upload_file'), save)
  .post('/postDetail/:id', update)
  .get('/read/:id', readFile);
export default route;
