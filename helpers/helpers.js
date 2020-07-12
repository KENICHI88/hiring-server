import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  const u = {
    username : user.username,
    email : user.email,
    roleId : user.roleId,
    team: user.team
  }
  
  const token = jwt.sign(u, 'key', {
    expiresIn: '3h'
  })
  return token;
}


export const getCleanUser = (user) => {
  if(!user) return {};

  var u = user.toJSON();
  return {
    _id: u._id,
    fullname: u.fullname,
    username: u.username,
    email: u.email,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
    teamId: u.teamId,
    roleId: u.roleId,
  }
}


export const checkToken = (req, res, next) => {
  if(req.baseUrl == '/user/login' || req.baseUrl == '/user/logout' || req.baseUrl.indexOf('/file/read') > -1 ) {
    next();
  }else {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    
    if(token && token.startsWith('Bearer')) {
      token = token.slice(7, token.length);
    }
    
    if(token){
      jwt.verify(token, 'key', (err, decoded) => {
        if(err){
          res.status(401);
          res.json({
            result: 'FAIL',
            message: err
          })
        } else {
          req.decoded = decoded;
          next();
        }
      })
    }else {
      res.status(401);
      res.json({
        result: 'FAIL',
        message: 'Auth token is not supplied'
      })
    }
  }
  
  
}
