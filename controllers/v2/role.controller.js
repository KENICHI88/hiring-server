
import roleModel from '../../dbModels/v2/roleModel';

exports.getList = (req, res, next) => {
  try {
    const cond = req.query;
    let condition = {};
    if(cond) {
      condition ={...condition, ...cond};
    }
    const rs = roleModel
      .find(condition)
      .sort([['createdAt', -1]])
      .lean()
      .then(result => {
        res.status(200);
        res.json({result: [...result], status: 'OK'});
      })
      .catch(err => {
        res.status(400);
        res.json({message: error.message, status: 'FAIL'});
      })
  } catch(error) {
    res.status(500);
    res.json({message: error.message, status: 'FAIL'});
    next();
  }
}

exports.getDetail = (req, res, next) => {
  try {
    const id = req.params.id;
    roleModel.findById({_id: id})
      .exec()
      .then(result => {
        res.status(200);
        res.json({result: result, status: 'OK'});
      })
      .catch(error => {
        res.status(400);
        res.json({message: error.message, status: 'FAIL'});
      });
  } catch(error){
    res.status(500);
    res.json({message: error.message, status: 'FAIL'});
    next();
  }
}

exports.save = (req, res, next) => {
  try {
    const data = req.body;
    const values = new roleModel(data);
    const error = values.validateSync();
    if(!error) {
      roleModel.create(data, (error, result) => {
        if(error) {
          res.status(400);
          res.json({message: error.message, status: 'FAIL'});
        }
        res.status(200);
        res.json({result: result, status: 'OK'});
      })
    }else {
      res.status(500);
      res.json({message: error.message, status: 'FAIL'});
    }
  } catch(error) {
    res.status(500);
    res.json({message: error.message, status: 'FAIL'});
    next();
  }
}

exports.update = (req, res, next) => {
  try {
    const data = req.body;
    roleModel.findByIdAndUpdate(req.params.id, data, 
      {lean: true, rawResult: false, select: ['_id']},
      (error, result) => {
        if(error) {
          res.status(400);
          res.json({message: error.message, status: 'FAIL'});
        }else {
          res.status(200);
          res.json({result: {...result}, status: 'OK'});
        }
      });
  } catch(error) {
    res.status(500);
    res.json({message: error.message, status: 'FAIL'});
    next();
  }
}
