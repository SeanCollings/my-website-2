import mongoose, { Schema } from 'mongoose';

const subscriptionSchema = new Schema({
  endpoint: String,
  keys: {
    auth: String,
    p256dh: String
  },
  _user: { type: Schema.Types.ObjectId, ref: 'users' }
});

mongoose.model('subscriptions', subscriptionSchema);
