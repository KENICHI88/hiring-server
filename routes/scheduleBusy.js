import express from 'express';

const route = express.Router();

import {getListByUser, create, getBusyDateListByMonth } from '../controllers/scheduleBusy.controller';

route
  .get('/', (req, res, next) => {
    res.status(200);
    res.json('OK');
  })
  .get('/getlistbyuser/:userId', getListByUser)
  .post('/saveone', create)
  .get('/getBusyDateByMonth/:monthyear', getBusyDateListByMonth)
  
module.exports = route;
