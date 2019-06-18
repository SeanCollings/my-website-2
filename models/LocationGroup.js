import mongoose, { Schema } from 'mongoose';

const LocationGroupSchema = new Schema({
  name: String,
  icon: String,
  Location: { lat: String, lng: String },
  createdDate: Date,
  createdBy: String,
  createdById: { type: Schema.Types.ObjectId, ref: 'users' },
  members: [{ _user: { type: Schema.Types.ObjectId, ref: 'users' } }]
});

mongoose.model('locationgroups', LocationGroupSchema);
