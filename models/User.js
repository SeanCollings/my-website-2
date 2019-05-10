import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  googleId: String,
  givenName: String,
  familyName: String,
  emailAddress: String,
  superUser: { type: Boolean, default: false },
  pererittoUser: { type: Boolean, default: true } /* Default to false after */
});

mongoose.model('users', userSchema);
