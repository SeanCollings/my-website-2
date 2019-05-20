import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  googleId: String,
  givenName: String,
  familyName: String,
  emailAddress: String,
  googlePhoto: String,
  superUser: { type: Boolean, default: false },
  pererittoUser: { type: Boolean, default: false },
  _pereritto: { type: Schema.Types.ObjectId, ref: 'pererittos' }
});

mongoose.model('users', userSchema);
