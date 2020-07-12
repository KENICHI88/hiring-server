import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const fileModel = new Schema({
  name: {
    type: String,
    required: true,
  },
  extension: {
    type: String,
    required: true,
  },
  createrId: {
    type: 'ObjectId',
    ref: 'users',
    required: true
  },
  file: {
    type: String,
  },
  fileSize: {
    type: Number,
    default: 0
  },
  isDir: {
    type: Boolean,
    required: true,
  },
  directory: {
    type: String,
    required: true,
    default: '/',
  },
}, {
  timestamps: true
})


export default mongoose.model('files', fileModel);
