import scheduleInterviewModel from '../dbModels/scheduleInterview';
import moment from 'moment';

exports.getListAll = async (req, res, next) => {
  try {
    const startMonth = moment(`${req.query.activeDate}`, moment.ISO_8601).startOf('month').toDate();
    const endMonth = moment(`${req.query.activeDate}`, moment.ISO_8601).endOf('month').toDate();
    await scheduleInterviewModel
    .aggregate([
      {
        $lookup: {
          from : 'candidates',
          localField: 'candidateId',
          foreignField: '_id',
          as: 'candidateInfo'
        }
      },
      {
        $lookup: {
          from : 'users',
          localField: 'leaderId',
          foreignField: '_id',
          as: 'leaderInfo'
        }
      },
    ])
    .match({
      dateTimeInterview : {$gte: startMonth, $lte: endMonth}
    })
    .exec()
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(405);
      res.json(err);
    })
  } catch(err) {
    res.json(err);
    next();
  }
}

exports.getListCount = async (req, res, next) => {
  try {
    let activeDate = req.query.activeDate ? req.query.activeDate : moment().format();
    let startMonth,
          endMonth,
          byCondition = req.query.byCondition ? req.query.byCondition : 'week';
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
    
    await scheduleInterviewModel
    .countDocuments({
      dateTimeInterview : {$gte: start, $lte: end}
    })
    .exec()
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(405);
      res.json(err);
    })
  } catch(err) {
    res.json(err);
    next();
  }
}

exports.getListByUser =  (req, res, next) => {
  try {
    const userId = req.query.userId;
    let condition = {};
    if(userId && userId !='') {
      condition = {userId : userId}
    } else {
      res.status(200);
      res.json({});
      next();
    }
    const rs =  userModel.find(condition)
    .populate({path: 'userId', select: '_id username fullname'})
    .exec((err, result) => {
      if(err) {
        res.status(405);
        res.json(err);
      }else {
        res.status(200);
        res.json(result);
      }
    })
  } catch(err) {
    res.json(err);
    next();
  }
}

exports.create = (req, res, next) => {
  try {
    const interviewInfor = req.body;
    const values = new scheduleInterviewModel(interviewInfor);
    const error = values.validateSync();
    if(!error) {
      scheduleInterviewModel.create(interviewInfor,
        (err, result) => {
          if(err) {
            res.status(405);
            res.json(err);
          }else {
            res.status(200);
            result.result = 'OK';
            res.json(result);
          }
        })
    } else {
      throw Error(error);
    }
  } catch (err) {
    res.status(500);
    res.json(err);
  }
}

exports.update = (req, res, next) => {
  try {
    const interviewInfor = req.body;
    scheduleInterviewModel.findOneAndUpdate({_id : interviewInfor._id}, interviewInfor, (err, result) => {
      if(err) {
        res.status(200);
        res.json(err);
      }else {
        let {_doc} = result;
        let value = {..._doc};
        value.result = 'OK';
        res.json(value);
      }
    })
  }catch (err) {
    res.status(500);
    res.json(err);
  }
}
