import express from 'express';

const route = express.Router();

import {create,
  getListAll,
  getListCount,
  update} from '../controllers/scheduleInterview.controller';

route
  .get('/', (req, res, next) => {
    res.status(200);
    res.json('OK');
  })
  .get('/getList',  getListAll)
  .get('/getListCount',  getListCount)
  .post('/saveOne', create)
  .put('/updateOne', update)
  
module.exports = route;
