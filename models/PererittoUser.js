import mongoose, { Schema } from 'mongoose';

const pererittoSchema = new Schema({
  name: String,
  count: { type: Number, default: 0 },
  colour: String,
  lastWinner: { type: Boolean, default: false }
});

mongoose.model('pererittos', pererittoSchema);
