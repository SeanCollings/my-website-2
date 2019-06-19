import mongoose, { Schema } from 'mongoose';

const LocationGroupSchema = new Schema({
  name: String,
  icon: String,
  location: { lat: Number, lng: Number },
  createdDate: Date,
  createdBy: String,
  createdById: { type: Schema.Types.ObjectId, ref: 'users' },
  members: [{ _user: { type: Schema.Types.ObjectId, ref: 'users' } }]
});

mongoose.model('locationgroups', LocationGroupSchema);
