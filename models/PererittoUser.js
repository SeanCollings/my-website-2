import mongoose, { Schema } from 'mongoose';

const pererittoSchema = new Schema({
  name: String,
  count: { type: Number, default: 0 }
});

mongoose.model('pererittos', pererittoSchema);
