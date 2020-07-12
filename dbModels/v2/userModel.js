import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userModel = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
  },
  age: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  }, 
  teamId: {
    type: 'ObjectId',
    ref: 'teams',
    // required: true
  },
  roleId: {
    type: 'ObjectId',
    ref: 'roles',
    required: true
  },
  office: {
    type: String,
    default: 'VN'
  },
  type: {
    type: String, // 'isMember', 'isCandidate'
    required: true,
    default: 'isCandidate'
  },
  fileId: {
    type: 'ObjectId',
    ref: 'files',
  },
  references: {
    type: String,
  },
  status: {
    type: Number, // 1: Active, 2: Inactive, 3: Other
    default: 1,
  },
}, {
  timestamps: true
});

export default mongoose.model('users', userModel);
