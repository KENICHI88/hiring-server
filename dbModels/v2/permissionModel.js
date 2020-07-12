import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const permissionModel = new Schema({
  name : {
    type: String,
    required: true
  },
  // roleId: {
  //   type: 'ObjectId',
  //   ref: 'roles',
  //   required: true
  // },
  route: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true
})


export default mongoose.model('permissions', permissionModel);
