import mongoose from 'mongoose';

const Schema = mongoose.Schema;


const teamModel = new Schema({
  name : {
    type: String,
    required: true
  },
  leaderId: {
    type: 'ObjectId',
    ref: 'users',
  },
}, {
  timestamps: true
})


export default mongoose.model('teams', teamModel);
