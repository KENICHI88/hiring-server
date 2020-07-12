import roleModel from '../dbModels/roleModel';


exports.getList = (req, res, next) => {
  try {
    const rs = roleModel.find({
      parent: {$ne: 1}
    }, (err, result) => {
      if(err) {
        res.json(err);
      }else {
        res.json(result);
      }
    })
  } catch(error) {
    res.json(err);
    next();
  }
}

exports.getOne = (req, res, next) => {
  try {
    const id = req.params.id;
    roleModel.findById({_id: id}, (err, result) => {
      if(err) {
        res.status(500);
        res.json(err);
      }
      res.json(result);
    })
  } catch(error){
    res.json(err);
    next();
  }
}

exports.create = (req, res, next) => {
  try {
    roleModel.create(dummyData, (err, result) => {
      if(err) {
        res.json(err);
      }else {
          
        res.send('Done')
        next();
      }
    })
  } catch(error) {
    res.json(err);
    next();
  }
}

exports.deleteAll = (req, res, next) => {
  try {
    roleModel.find({}, (err, list) => {
      if(err){
        res.send('Error while create dummy data');
      }
      if(list) {
        let rs = [], listPromise = [];
        
        list.map(item => {
          roleModel.findOneAndRemove({_id: item._id}, {useFindAndModify: false}, (err, result) => {
            rs = [...rs, result];
          });
        })
        
        res.json(rs);
      }
    })
  } catch(error) {
    res.json(err);
    next();
  }
}

exports.deleteOne = (req, res, next) => {
  try {
    const id = req.params.id;
    roleModel.findOneAndRemove({_id: id}, {useFindAndModify: false}, (err, result) => {
      if(err) {
        res.render('error');
      } else {
        next();
      }
    });
  } catch(error) {
    res.json(err);
    next();
  }
}
