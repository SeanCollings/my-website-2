import mongoose, { Schema } from 'mongoose';

const pereryvSchema = new Schema({
  name: String,
  color: String,
  position: Number,
  active: { type: Boolean, default: true },
  paid: { type: Boolean, default: false }
});

mongoose.model('pereryvs', pereryvSchema);
