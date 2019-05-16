import mongoose, { Schema } from 'mongoose';

const pererittoSchema = new Schema({
  name: String,
  colour: String,
  _user: { type: Schema.Types.ObjectId, ref: 'users' }
});

mongoose.model('pererittos', pererittoSchema);
