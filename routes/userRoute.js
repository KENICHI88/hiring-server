const express = require('express');
const router = express.Router();

import userModel from '../dbModels/usersModel';

import {
    getList,
    getlistCount,
    getOne,
    create,
    login,
    reAuthenticate,
    getListWithBusyDate
} from '../controllers/user.controller';

router
  .get('/', (req, res, next) => {
    res.send('respond');
  })
  .get('/getlist', getList )
  .get('/getlistCount', getlistCount)
  .get('/getlistWithBusyDate', getListWithBusyDate )
  .get('/getone/:id', getOne)
  .post('/saveOne', create)
  .post('/login', login)
  .post('/reAuthentication', reAuthenticate)
  .delete('/delete/:id', (req, res, next) => {
    try {
      
    } catch(err) {
      res.json(err);
    }
  })


module.exports = router;
