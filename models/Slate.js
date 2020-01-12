import mongoose, { Schema } from 'mongoose';

const slateSchema = new Schema({
  name: String,
  members: Array,
  createdDate: Date,
  completedDate: Date,
  completed: { type: Boolean, default: false }
});

mongoose.model('slates', slateSchema);
