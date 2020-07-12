import express from 'express';
///////
import {
  getList,
  getDetail,
  save,
  update,
} from '../../controllers/v2/team.controller';

const route = express.Router();

route
  .get('/getList',  getList)
  .get('/getDetail/:id', getDetail)
  .post('/postDetail/', save)
  .post('/postDetail/:id', update)

export default route;
