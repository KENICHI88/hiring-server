import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const scheduleInterviewModel = new Schema({
  leaderId: {
    type: 'ObjectId',
    ref: 'users',
    required: true
  },
  candidateId: {
    type: 'ObjectId',
    ref: 'candidates',
    required: true
  },
  team: {
    type: String,
    required: true,
  },
  dateTimeInterview: {
    type: 'Date',
    required: true,
  },
  comment: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: ''
  },
}, {
  timestamps: true
})

export default mongoose.model('scheduleInterviews', scheduleInterviewModel);
