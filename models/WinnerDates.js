import mongoose, { Schema } from 'mongoose';

const winnerDatesSchema = new Schema({
  date: String,
  year: Number,
  _winner: { type: Schema.Types.ObjectId, ref: 'pererittos' }
});

mongoose.model('winnerDates', winnerDatesSchema);
