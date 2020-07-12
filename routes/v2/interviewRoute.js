import express from 'express';
///////
import {
  getList,
  getDetail,
  save,
  update,
  getListByMonth,
} from '../../controllers/v2/interview.controller';

const route = express.Router();

route
  .get('/getList',  getList)
  .get('/getDetail/:id', getDetail)
  .post('/postDetail/', save)
  .post('/postDetail/:id', update)
  .get('/getListByMonth/:monthYear', getListByMonth)

export default route;
