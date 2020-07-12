import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const scheduleBusyModel = new Schema({
  userId: {
    type: 'ObjectId',
    ref: 'users',
    required: true
  },
  dateBusy: {
    type: 'Date',
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true
  }
}, {
  timestamps: true
})

export default mongoose.model('schedulebusies', scheduleBusyModel);
