import userModel from '../dbModels/usersModel';
import bcrypt from 'bcrypt';
import {generateToken, getCleanUser} from '../helpers/helpers';
import jwt from 'jsonwebtoken';

exports.getList =  (req, res, next) => {
  try {
    const keysearch = req.query.keysearch;
    let condition = {};
    if(keysearch && keysearch !='') {
      const reg = new RegExp( keysearch , 'ig');
      condition = {username : reg}
    }
    const rs =  userModel.find(condition)
      .populate({path: 'roleId', select: '-_id name skey'})
      .sort([['createdAt', -1]])
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

exports.getlistCount =  (req, res, next) => {
  try {
    let condition = {};
    const rs =  userModel.estimatedDocumentCount(condition)
      .populate({path: 'roleId', select: '-_id name skey'})
      .sort([['createdAt', -1]])
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

exports.getListWithBusyDate = async (req, res, next) => {
  try {
    await userModel.aggregate([
      {
        $lookup: {
          from : 'schedulebusies',
          localField: '_id',
          foreignField: 'userId',
          as: 'busyDate'
        }
      }
    ]).exec()
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

exports.getOne = (req, res, next) => {
  try {
    const id = req.params.id;
    userModel.findById(id)
      .populate({path: 'roleId', select: '-_id _name skey'})
      .exec((err, result) => {
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
    next();
  }
}
exports.create = (req, res, next) => {
  try {
    const userInfor = req.body;
    const values = new userModel(userInfor);
    const error = values.validateSync();
    if(!error) {
      
      const hashPassword = bcrypt.hashSync(userInfor.password, 10);
      userInfor.password = hashPassword;
      
      if(values._id && values._id !==''){
        userModel.findByIdAndUpdate( userInfor._id ,userInfor, (err, result) => {
          if(err) {
            res.status(405);
            res.json(err);
          }else {
            res.status(200);
            result.result = 'OK';
            const token = generateToken(userInfor);
            result.user = userInfor;
            result.token = token;
            res.json(result);
          }
        })
      }else {
        userModel.create(userInfor, (err, result) => {
          if(err) {
            res.status(405);
            res.json(err);
          }else {
            res.status(200);
            result.result = 'OK';
            const token = generateToken(userInfor);
            result.user = userInfor;
            result.token = token;
            res.json(result);
          }
        })
      }
      
      
    }else {
      throw Error(error);
    }
  } catch(err) {
    res.status(500);
    res.json(err);
  }
}

exports.login = (req, res, next) => {
  try {
    userModel.findOne({username: req.body.username})
      .populate({path: 'roleId', select: '_id name skey'})
      .exec((error, userInfor) => {
        if(error) throw error;
        if(!userInfor) {
          return res.status(404).json({
            error: true,
            message: `Username doesn't exist `
          })
        }
        bcrypt.compare(req.body.password, userInfor.password, (err, valid) => {
          if(!valid) {
            return res.status(404).json({
              error: true,
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

exports.reAuthenticate = (req, res, next) => {
  try {
    const token = req.body.token || req.query.token;
    if(!token) {
      return res.status(401).json({error: true, message: 'Must pass token'});
    }
    
    jwt.verify(token, 'key', (err, userInfor) => {
      if(err) throw err;
      userModel.findById({'_id': userInfor._id}, (err, user) => {
        if(err) throw err;
        
        user = getCleanUser(user);
        
        res.status(200).json({
          user: user,
          token : token
        })
      })
    })

  } catch(err) {
    res.status(500);
    res.json(err)
  }
}

///////
