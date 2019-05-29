import mongoose, { Schema } from 'mongoose';

const pastAwardSchema = new Schema({
  title: String,
  year: Number,
  _pereritto: { type: Schema.Types.ObjectId, ref: 'pererittos' },
  _award: { type: Schema.Types.ObjectId, ref: 'awards' }
});

mongoose.model('pastawards', pastAwardSchema);
