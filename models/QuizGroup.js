import mongoose, { Schema } from 'mongoose';

const quizGroupSchema = new Schema({
  title: String,
  createdDate: Date,
  lastEditedDate: Date,
  isPublic: { type: Boolean, default: true },
  _user: { type: Schema.Types.ObjectId, ref: 'users' }
});

mongoose.model('quizgroups', quizGroupSchema);
