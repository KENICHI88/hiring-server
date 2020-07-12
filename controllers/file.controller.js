import fs from 'fs';
import path from 'path';

exports.getOne = (req, res, next) => {
  try {
    var file = path.join(__dirname, '../uploads/' ,decodeURIComponent(req.params.fileName));
    fs.readFile(file, 'utf8', function (err, data) {
      if (err)
        throw err;

      res.send({status: 'success', data: data});
    });
  }catch (e) {
    res.json({status: 'failed', message: e});
  };
}

exports.getOne2 = (req, res, next) => {
  try {
    var file = path.join(__dirname, '../uploads/' ,decodeURIComponent(req.params.fileName));

    var stream = fs.createReadStream(file);
    stream.on('error', function(error) {
      res.writeHead(404, 'Not Found');
      res.end();
    });
    stream.pipe(res);
    
  }catch (e) {
    res.json({status: 'failed', message: e});
  };
}
