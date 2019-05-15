import mongoose, { Schema } from 'mongoose';

const pererittoSchema = new Schema({
  name: String,
  colour: String
});

mongoose.model('pererittos', pererittoSchema);
