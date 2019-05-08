import mongoose, { Schema } from 'mongoose';

const pererittoSchema = new Schema({
  name: String,
  count: { type: Number, default: 0 },
  colour: String,
  lastWinner: Boolean
});

mongoose.model('pererittos', pererittoSchema);
