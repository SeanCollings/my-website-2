import mongoose, { Schema } from 'mongoose';

const currentAwardSchema = new Schema({
  title: String,
  year: Number,
  _user: { type: Schema.Types.ObjectId, ref: 'users' },
  _award: { type: Schema.Types.ObjectId, ref: 'awards' }
});

mongoose.model('currentawards', currentAwardSchema);
