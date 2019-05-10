import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  googleId: String,
  givenName: String,
  familyName: String,
  emailAddress: String,
  superUser: { type: Boolean, default: false },
  pererittoUser: { type: Boolean, default: false }
});

mongoose.model('users', userSchema);
