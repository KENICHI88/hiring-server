
import multer from 'multer';
import fs from 'fs';
import path from 'path';

import fileModel from '../../dbModels/v2/fileModel';

const pathUpload = './uploads/';

const diskStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, pathUpload);
  },
  filename: (req, file, callback) => {
    let match = ['image/png', 'image/jpeg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if(match.indexOf(file.mimetype) === -1) {
      let errorMess = `The file upload is invalid`;
      return callback(errorMess, null);
    }
    const date = new Date();
    const prefix = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}-${Math.random().toString().substr(2,8)}`;
    let filename = `${prefix}-cv-${file.originalname.replace(/_/g, '')}`;
    callback(null, filename);
  }
});

const removePhysicalFile = async (fileName) => {
  try {
    fs.unlinkSync(pathUpload+fileName);
  }catch(error) {
    console.log(error);
  }
}

const uploadFile = multer({storage: diskStorage});
exports.uploadFile = uploadFile;

exports.getList = (req, res, next) => {
  try {
    const cond = req.query;
    let condition = {};
    if(cond) {
      condition ={...condition, ...cond};
    }
    const rs = fileModel
      .find(condition)
      .populate({path: 'createrId', select: '_id username'})
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
    fileModel.findById({_id: id})
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
    let data = req.body;
    const file = req.file;
    if(!file) {
      res.status(400);
      res.json({message: error.message, status: 'FAIL'});
    } else {
      
      data.file = file.filename;
      delete data._id;
      
      let extension = file.originalname.substring((1+file.originalname.lastIndexOf('.')), file.originalname.length).toUpperCase();
      data.extension = extension;
      data.fileSize = file.size;
      
      const values = new fileModel(data);
      const error = values.validateSync();
      if(!error) {
        fileModel.create(data, (err, result) => {
          if(err) {
            console.log(err);
            res.status(400);
            res.json({message: error.message, status: 'FAIL'});
          }else {
            res.status(200);
            res.json({result: result, status: 'OK'});
          }
        })
      }else {
        if(file && file.filename) {
          removePhysicalFile(file.filename);
        }
        res.status(500);
        res.json({message: error.message, status: 'FAIL'});
      }
    }
  } catch(err) {
    const file = req.file;
    if(file && file.filename) {
      removePhysicalFile(file.filename);
    }
    res.status(500);
    res.json({message: error.message, status: 'FAIL'});
  }
}

exports.update = (req, res, next) => {
  try {
    const data = req.body;
    fileModel.findByIdAndUpdate(req.params.id, data, 
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

exports.readFile = async (req, res, next) => {
  try {
    const id = req.params.id;
    await fileModel.findById(id)
      .exec()
      .then(result => {
        var file = path.join(__dirname, '../../uploads/' ,decodeURIComponent(result.file));
        console.log(file);
        var stream = fs.createReadStream(file);
        stream.on('error', function(error) {
          res.writeHead(404, 'Not Found');
          res.end();
        });
        stream.pipe(res);
      })
      .catch(error => {
        res.status(404);
        res.json({message: error.message, status: 'FAIL'});
      })
    
    // var file = path.join(__dirname, '../uploads/' ,decodeURIComponent(req.params.fileName));

    // var stream = fs.createReadStream(file);
    // stream.on('error', function(error) {
    //   res.writeHead(404, 'Not Found');
    //   res.end();
    // });
    // stream.pipe(res);
    
  } catch(error) {
    res.status(500);
    res.json({message: error.message, status: 'FAIL'});
    next();
  }
}
