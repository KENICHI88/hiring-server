import candidateModel from '../dbModels/candidateModel';
import moment from 'moment';

exports.getList = (req, res, next) => {
  try {
    const cond = req.query;
    let condition = {};
    if(cond) {
      condition ={...condition, ...cond};
    }
    candidateModel.find(condition, null, { sort : {createdAt: -1} }, (err, result) => {
      if(err) {
        res.status(405);
        res.json(err)
      }else {
        res.status(200);
        res.json(result)
      }
    })
  }catch(err) {
    res.json(err);
    next();
  }
}

exports.getCountList = async (req, res, next) => {
  try {
    let activeDate = req.query.activeDate ? req.query.activeDate : moment().format(),
        byCondition = req.query.byCondition ? req.query.byCondition : 'month';
    
    let start, end;
    switch(byCondition) {
      case 'day':
        start = moment(`${activeDate}`, moment.ISO_8601).startOf('date').toDate();
        end = moment(`${activeDate}`, moment.ISO_8601).endOf('date').toDate();
        break;
      case 'week':
        start = moment(`${activeDate}`, moment.ISO_8601).startOf('week').toDate();
        end = moment(`${activeDate}`, moment.ISO_8601).endOf('week').toDate();
        break;
      case 'month':
      default:
        start = moment(`${activeDate}`, moment.ISO_8601).startOf('month').toDate();
        end = moment(`${activeDate}`, moment.ISO_8601).endOf('month').toDate();
        break;
    }
    
    await candidateModel
      .countDocuments({
        createdAt : {$gte: start, $lte: end}
      })
      .exec()
      .then(result => {
        res.json(result);
        next();
      })
      .catch(err => {
        res.status(405);
        res.json(err);
        next();
      })
    
  } catch(err) {
    res.json(err);
    next();
  }
}

exports.getOne = (req, res, next) => {
  try {
    const id = req.params.id;
    candidateModel.find(id, (err, result) => {
      if(err) {
        res.status(405);
        res.json(err);
      } else {
        res.status(200);
        res.json(result);
      }
    })
  } catch(err) {
    res.status(405);
    res.json(err);
  }
}

exports.create = (req, res, next) => {
  try {
    let candidateInfor = req.body;
    const file = req.file;
    if(!file) {
      res.status(405);
      res.json({});
    } else {
      candidateInfor.cv_url = file.filename;
      delete candidateInfor._id;
      const values = new candidateModel(candidateInfor);
      const error = values.validateSync();
      if(!error) {
        candidateModel.create(candidateInfor, (err, result) => {
          if(err) {
            res.status(405);
            res.json(err);
          }else {
            res.status(200);
            result.result = 'OK';
            res.json(result);
          }
        })
      }else {
        throw Error(error);
      }
    }
    
  } catch(err) {
    res.status(500);
    res.json(err);
  }
}

exports.update = (req, res, next) => {
  try {
    let candidateInfor = req.body;
    if(candidateInfor._id){
      candidateInfor.id = candidateInfor._id;
    }
    const file = req.file;
    if(file) {
      candidateInfor.cv_url = file.filename;
    }
    candidateModel.findByIdAndUpdate(candidateInfor.id, candidateInfor, 
        {lean: true, rawResult: true, select: ['_id']},
      (err, result) => {
      if(err) {
        res.status(405);
        res.json(err);
      }else {
        res.status(200);
        let {value} = result;
        value = {...value};
        value.result = 'OK';
        res.json(value);
      }
    })
  }catch(err) {
    res.status(500);
    res.json(err);
  }
}

exports.deleteOne = (req, res, next) => {
  try {
      
  } catch(err) {
    res.json(err);
  }
}
