import mongoose, { Schema } from 'mongoose';

const tempUserSchema = new Schema({
  givenName: String,
  familyName: String,
  emailAddress: { type: String, unique: true, lowercase: true },
  password: String,
  createdDate: { type: Date, expires: 86400, default: Date.now },
  verificationString: String,
  googleUser: { type: Boolean, default: false },
  tempUser: { type: Boolean, default: true }
});

mongoose.model('tempusers', tempUserSchema);
