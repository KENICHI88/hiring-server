import express from 'express';
import roleModel from '../dbModels/roleModel';
///////
import dummyData from '../dummyData/roleData';
///////
import {getList, getOne, create, deleteAll, deleteOne} from '../controllers/role.controller';


const route = express.Router();


route
  .get('/getlist',  getList)
  .get('/getone/:id', getOne)
  .get('/createdata', create)
  .get('/deleteAll', deleteAll)
  .get('/deleteOne/:id', deleteOne)

export default route;
