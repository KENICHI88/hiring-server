
import permissionModel from '../../dbModels/v2/permissionModel';

exports.getList = (req, res, next) => {
  try {
    const cond = req.query;
    let condition = {};
    if(cond) {
      condition ={...condition, ...cond};
    }
    const rs = permissionModel
      .find(condition)
      .sort([['route', -1], ['createdAt', -1]])
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
    permissionModel.findById({_id: id})
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
    const values = new permissionModel(data);
    const error = values.validateSync();
    if(!error) {
      permissionModel.create(data, (error, result) => {
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
    permissionModel.findByIdAndUpdate(req.params.id, data, 
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
