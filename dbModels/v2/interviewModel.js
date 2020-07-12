import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const interviewModel = new Schema({
  candidateId: {
    type: 'ObjectId',
    ref: 'users',
    required: true
  },
  interviewerId: {
    type: 'ObjectId',
    ref: 'users',
    required: true
  },
  participaters: {
    type: String,
    required: false,
  },
  dateTime: {
    type: 'Date',
    required: true,
  },
  note: {
    type: String,
  },
  status: {
    type: Number, //0: pending, 1: accept interview, 2: cancel interview
    required: true,
    default: 0
  },
  result: {
    type: Number, // 0: Not yet, 1: pass, 2: fail
    required: true,
    default: 0
  }
}, {
  timestamps: true
})


export default mongoose.model('interviews', interviewModel);
