import mongoose, { Schema } from 'mongoose';

const quizContentSchema = new Schema({
  question: String,
  answer: String,
  isPublic: { type: Boolean, default: false },
  _user: { type: Schema.Types.ObjectId, ref: 'users' },
  _quizGroup: { type: Schema.Types.ObjectId, ref: 'quizgroups' }
});

mongoose.model('quizcontent', quizContentSchema);
