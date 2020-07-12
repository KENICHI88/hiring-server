
import interviewModel from '../../dbModels/v2/interviewModel';
import moment from 'moment';

exports.getList = (req, res, next) => {
  try {
    const cond = req.query;
    let condition = {};
    if(cond) {
      condition ={...condition, ...cond};
    }
    const rs = interviewModel
      .find(condition)
      .populate({path: 'candidateId', select: '_id username'})
      .populate({path: 'interviewerId', select: '_id username'})
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

exports.getListByMonth = (req, res, next) => {
  try {
    let monthYear = req.params.monthYear;
    
    if(monthYear) {
      monthYear = moment(`${monthYear}`).format();
    } else {
      monthYear = moment().format();
    }

    const start = moment(`${monthYear}`, moment.ISO_8601).startOf('month').toDate(),
          end = moment(`${monthYear}`, moment.ISO_8601).endOf('month').toDate();

    const rs = interviewModel
      .aggregate([
        {
          $lookup: {
            from : 'users',
            localField: 'candidateId',
            foreignField: '_id',
            as: 'candidateInfo'
          },
        },
        {
          $lookup: {
            from : 'users',
            localField: 'interviewerId',
            foreignField: '_id',
            as: 'interviewerInfo'
          }
        },
      ])
      .match({
        dateTime : {$gte: start, $lte: end}
      })
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
    interviewModel.findById({_id: id})
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
    const values = new interviewModel(data);
    const error = values.validateSync();
    if(!error) {
      interviewModel.create(data, (error, result) => {
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
    interviewModel.findByIdAndUpdate(req.params.id, data, 
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
