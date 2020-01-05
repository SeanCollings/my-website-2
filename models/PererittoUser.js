import mongoose, { Schema } from 'mongoose';

const pererittoSchema = new Schema({
  name: String,
  colour: String,
  active: { type: Boolean, default: true },
  retired: { type: Boolean, default: false },
  retiredDates: [{ year: String, dates: Array }],
  returnedDates: [{ year: String, dates: Array }],
  absentDates: Array
});

mongoose.model('pererittos', pererittoSchema);
