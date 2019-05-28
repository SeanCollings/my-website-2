import mongoose, { Schema } from 'mongoose';

const AwardSchema = new Schema({
  image: String,
  type: Number,
  canFall: Boolean,
  fallAngle: String,
  position: Number
});

mongoose.model('awards', AwardSchema);
