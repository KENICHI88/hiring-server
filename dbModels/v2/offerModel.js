import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const offerModel = new Schema({
  candidateId: {
    type: 'ObjectId',
    ref: 'users',
    required: true
  },
  createrId: {
    type: 'ObjectId',
    ref: 'users',
    required: true
  },
  approverId: {
    type: 'ObjectId',
    ref: 'users',
    required: true
  },
  note: {
    type: String,
  },
}, {
  timestamps: true
})


export default mongoose.model('offers', offerModel);
