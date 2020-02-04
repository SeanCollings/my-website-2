import mongoose, { Schema } from 'mongoose';

const quizRoundSchema = new Schema({
  round: [
    {
      read: { type: Boolean, default: false },
      content: { type: Schema.Types.ObjectId, ref: 'quizcontent' },
      _quizGroup: { type: Schema.Types.ObjectId, ref: 'quizgroups' }
    }
  ],
  lastPlayed: Date,
  requiresUpdate: { type: Boolean, default: false },
  _user: { type: Schema.Types.ObjectId, ref: 'users' }
});

mongoose.model('quizrounds', quizRoundSchema);
