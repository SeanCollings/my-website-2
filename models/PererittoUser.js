import mongoose, { Schema } from 'mongoose';

const pererittoSchema = new Schema({
  name: String,
  colour: String,
  active: { type: Boolean, default: true }
});

mongoose.model('pererittos', pererittoSchema);
