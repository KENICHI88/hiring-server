
import userModel from '../../dbModels/v2/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {generateToken, getCleanUser} from '../../helpers/helpers';

exports.getList = (req, res, next) => {
  try {
    const cond = req.query;
    let condition = {};
    if(cond) {
      condition ={...condition, ...cond};
    }
    const rs = userModel
      .find(condition)
      .populate({path: 'roleId', select: '_id name'})
      .populate({path: 'teamId', select: '_id name'})
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

exports.getListCandidateAvailable = (req, res, next) => {
  try {
    const cond = req.query;
    let condition = {};
    if(cond) {
      condition ={...condition, ...cond};
    }
    const rs = userModel
      .aggregate([
        {
          $lookup: {
            from : 'interviews',
            localField: '_id',
            foreignField: 'candidateId',
            as: 'interviewInfo',
          },
          
        },
        {
          $unwind: {
            path: '$interviewInfo',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $match: {
            $or : [
              {
                $and : [{
                  'interviewInfo.result' : 2 // 0: pending, 1: pass, 2: fail
                },
                {
                  type : 'isCandidate'
                }]
              },{
                $and : [{
                  'interviewInfo' : null
                },
                {
                  type : 'isCandidate'
                }]
              }
            ]
          }
        }
      ])
      .then(result => {
        res.status(200);
        res.json({result: [...result], status: 'OK'});
      })
      .catch(error => {
        res.status(400);
        res.json({message: error.message, status: 'FAIL'});
      })
  } catch(error) {
    console.log(error);
    res.status(500);
    res.json({message: error.message, status: 'FAIL'});
    next();
  }
}

exports.getListCandidatePassed = (req, res, next) => {
  try {
    const cond = req.query;
    let condition = {};
    if(cond) {
      condition ={...condition, ...cond};
    }
    const rs = userModel
      .aggregate([
        {
          $lookup: {
            from : 'interviews',
            localField: '_id',
            foreignField: 'candidateId',
            as: 'interviewInfo',
          },
          
        },
        {
          $unwind: {
            path: '$interviewInfo',
          }
        },
        {
          $match: {
            'interviewInfo.result' : 1, // 0: pending, 1: pass, 2: fail
          }
        }
      ])
      .then(result => {
        res.status(200);
        res.json({result: [...result], status: 'OK'});
      })
      .catch(error => {
        res.status(400);
        res.json({message: error.message, status: 'FAIL'});
      })
  } catch(error) {
    console.log(error);
    res.status(500);
    res.json({message: error.message, status: 'FAIL'});
    next();
  }
}

exports.getDetail = (req, res, next) => {
  try {
    const id = req.params.id;
    userModel.findById({_id: id})
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

exports.login = (req, res, next) => {
  try {
    const data = req.body;
    userModel.findOne({username: data.username})
      .populate({path: 'roleId', select: '_id username'})
      .populate({path: 'teamId', select: '_id name'})
      .exec((error, userInfor) => {
        if(error) {
          res.status(500);
          res.json({message: error.message, status: 'FAIL'});
        }
        if(!userInfor) {
          return res.status(404).json({
            status: 'FAIL',
            message: `Username doesn't exist `
          })
        }
        bcrypt.compare(data.password, userInfor.password, (err, valid) => {
          if(!valid) {
            return res.status(404).json({
              status: 'FAIL',
              message: 'Username/password is wrong'
            })
          }
          
          const token = generateToken(userInfor);
          
          userInfor = getCleanUser(userInfor);
          res.status(200).json({
            message: 'OK',
            user: userInfor,
            token: token
          })
        })
      })
  }catch(err){
    res.status(500);
    res.json(err);
  }
}

exports.save = (req, res, next) => {
  try {
    const data = req.body;
    const values = new userModel(data);
    const error = values.validateSync();
    if(!error) {
      const hashPassword = bcrypt.hashSync(data.password, 10);
      data.password = hashPassword;
      
      userModel.create(data, (error, result) => {
        if(error) {
          res.status(400);
          res.json({message: error.message, status: 'FAIL'});
        }
        const token = generateToken({data});
        res.status(200);
        res.json({result: result, status: 'OK', token: token});

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
    if(data.password && data.password !=='' && data.password !== undefined){
      const hashPassword = bcrypt.hashSync(data.password, 10);
      data.password = hashPassword;
    }
    
    userModel.findByIdAndUpdate(req.params.id, data, 
      {lean: true, rawResult: false, select: ['_id']},
      (error, result) => {
        if(error) {
          res.status(400);
          res.json({message: error.message, status: 'FAIL'});
        }else {
          const token = generateToken({data});
          res.status(200);
          res.json({result: result, status: 'OK', token: token});
        }
      });
  } catch(error) {
    res.status(500);
    res.json({message: error.message, status: 'FAIL'});
    next();
  }
}
