import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const candidateModel = new Schema({
  username : {
    type: String,
    required: true
  },
  age: {
    type: String,
    required: true,
    min: 1
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  cv_url: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: '001'
  },
  team: {
    type: String,
    require: true,
  },
  position: {
    type: String,
    require: true,
  },
  reference: {
    type: String,
  },
}, {
  timestamps: true
})

export default mongoose.model('candidates', candidateModel);
