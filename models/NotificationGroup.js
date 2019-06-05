import mongoose, { Schema } from 'mongoose';

const NotificationGroupSchema = new Schema({
  name: String,
  icon: String,
  createdDate: Date,
  createdBy: String,
  createdById: { type: Schema.Types.ObjectId, ref: 'users' },
  members: [{ _user: { type: Schema.Types.ObjectId, ref: 'users' } }]
});

mongoose.model('notificationgroups', NotificationGroupSchema);
