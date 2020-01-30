import mongoose, { Schema } from 'mongoose';

const quizRoundSchema = new Schema({
  round: [
    {
      read: { type: Boolean, default: false },
      content: { type: Schema.Types.ObjectId, ref: 'quizcontent' }
    }
  ],
  _user: { type: Schema.Types.ObjectId, ref: 'users' }
});

mongoose.model('quizrounds', quizRoundSchema);
