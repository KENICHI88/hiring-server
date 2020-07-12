import mongoose from 'mongoose';
import scheduleBusies from './scheduleBusyModel';

const Schema = mongoose.Schema;

const userModel = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
  },
  fullname: {
    type: String,
    required: true,
    default: 'Full name'
  },
  age: {
    type: String,
    required: true,
    default: 18
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    default: '0',
  },
  address: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  roleId: {
    type: 'ObjectId',
    ref: 'roles',
    required: true
  },
  team: {
    type: String,
    required: true,
    default: ' '
  },
  createdDate: {
    type: Date,
    default: Date.now()
  },
  status: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('users', userModel);
