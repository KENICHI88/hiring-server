
import express from 'express';
const route = express.Router();

import {getOne, getOne2} from '../controllers/file.controller';

route.get('/read/:fileName', getOne2);


module.exports = route;
