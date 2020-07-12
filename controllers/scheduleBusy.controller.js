import scheduleBusyModel from '../dbModels/scheduleBusyModel';
import moment from 'moment';

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
    const busyInfor = req.body;
    let values = new scheduleBusyModel(busyInfor);
    
    const error = values.validateSync();
    if(!error) {
      scheduleBusyModel.create(busyInfor,
        (err, result) => {
          if(err) {
            res.status(405);
            res.json(err);
          }else {
            res.status(200);
            let {_doc} = result;
            let value = {..._doc};
            value.result = 'OK';
            res.json(value);
          }
        })
    }else {
      
      throw Error(err);
    }
  } catch(err) {
    res.status(500);
    res.json(err);
  }
}


exports.getBusyDateListByMonth = async (req, res, next) => {
  try {
    const params = req.params;
    let datetime = '',
        condition = {};
    if(params && params.monthyear && params.monthyear !==''){
      datetime = params.monthyear.split('-'); // format: 2019-12
      let date = moment(`${datetime[0]}-${parseInt(datetime[1])+1}-01`).format();
      
      const startOfMonth = moment(`${date}`, moment.ISO_8601).startOf('month').toDate();
      const endOfMonth = moment(`${date}`, moment.ISO_8601).endOf('month').toDate();
      
      condition = {dateBusy : {
          $gt: startOfMonth,
          $lt: endOfMonth
      }}
      
    }
    
    scheduleBusyModel.find(condition)
      .populate({path: 'userId', select: '_id username fullname team'})
      .exec((err, result) => {
        if(err) {
          res.status(405);
          res.json(err);
        }else {
          res.status(200);
          res.json(result);
        }
      })
  }catch(error){
    res.json(error);
    next();
  }
}
