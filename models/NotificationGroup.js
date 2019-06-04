import mongoose, { Schema } from 'mongoose';

const NotificationGroupSchema = new Schema({
  name: String,
  image: String,
  createdBy: String,
  createdById: { type: Schema.Types.ObjectId, ref: 'users' },
  members: [{ _user: { type: Schema.Types.ObjectId, ref: 'users' } }]
});

mongoose.model('notificationgroups', NotificationGroupSchema);
