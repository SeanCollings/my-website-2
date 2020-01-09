import mongoose, { Schema } from 'mongoose';

const winnerDatesSchema = new Schema({
  date: String,
  year: Number,
  presentPlayers: Array,
  _winner: { type: Schema.Types.ObjectId, ref: 'pererittos' }
});

mongoose.model('winnerDates', winnerDatesSchema);
