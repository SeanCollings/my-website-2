import mongoose, { Schema } from 'mongoose';

const settingsSchema = new Schema({
  profilePic: { type: String, default: 'profilePhoto' },
  _user: { type: Schema.Types.ObjectId, ref: 'users' }
});

mongoose.model('settings', settingsSchema);
