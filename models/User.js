import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  googleId: String,
  givenName: String,
  familyName: String,
  emailAddress: String,
  googlePhoto: String,
  uploadedPhoto: String,
  splashes: { type: Number, default: 5 },
  lastSplashed: { type: Date, default: new Date(0) },
  superUser: { type: Boolean, default: false },
  pererittoUser: { type: Boolean, default: false },
  pereryvUser: { type: Boolean, default: false },
  allowNotifications: { type: Boolean, default: false },
  lastLogin: { type: Date, default: new Date() },
  _pereritto: { type: Schema.Types.ObjectId, ref: 'pererittos' },
  _pereryv: { type: Schema.Types.ObjectId, ref: 'pereryvs' }
});

mongoose.model('users', userSchema);
