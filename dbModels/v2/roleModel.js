import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const roleModel = new Schema({
  name : {
    type: String,
    required: true
  }
}, {
  timestamps: true
})


export default mongoose.model('roles', roleModel);
