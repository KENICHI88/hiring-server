import express  from 'express';

/////////////////////
const router = express.Router();
import companyModel from '../dbModels/companyModel';
/////////////////////



router.get('/', (req, res, next) => {
  companyModel.find({ _id }, (err, companyList) => {
    res.json(companyList);
    next();
  })
  
  // companyModel.estimatedDocumentCount({}, (err, count) => {
  //   res.json(count);
  //   next();
  // })
  
})


module.exports = router;
