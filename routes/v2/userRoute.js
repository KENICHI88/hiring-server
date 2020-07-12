import express from 'express';
///////
import {
  getList,
  getDetail,
  save,
  update,
  login,
  getListCandidateAvailable,
  getListCandidatePassed,
} from '../../controllers/v2/user.controller';

const route = express.Router();

route
  .get('/getList',  getList)
  .get('/getDetail/:id', getDetail)
  .post('/postDetail/', save)
  .post('/postDetail/:id', update)
  .post('/postLogin', login)
  .get('/getListCandidateAvailable', getListCandidateAvailable)
  .get('/getListCandidatePassed', getListCandidatePassed)

export default route;
