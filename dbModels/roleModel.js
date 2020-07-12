import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const roleModel = new Schema({
  name: {
    type: String,
    required: true
  },
  skey: {
    type: String,
    required: true,
  },
  parent: {
    type: Number,
    default: -1,
    required: true
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


export default mongoose.model('roles', roleModel);
