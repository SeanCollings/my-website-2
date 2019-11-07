import mongoose, { Schema } from 'mongoose';

const pererittoSchema = new Schema({
  name: String,
  colour: String,
  active: { type: Boolean, default: true },
  retired: { type: Boolean, default: false },
  retiredDate: { type: Date },
  absentDates: Array
});

mongoose.model('pererittos', pererittoSchema);
