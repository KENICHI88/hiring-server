import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const companySchema = new Schema({
  
  name: {type: String, required: true, max: 100},
  email_address: {type: String},
  description: {type: String},
  created_at: {type: Date}
}, {
  timestamps: true
})

export default mongoose.model('companies', companySchema);
