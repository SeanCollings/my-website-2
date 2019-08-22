import mongoose, { Schema } from 'mongoose';

const AppSettingsSchema = new Schema({
  pages: {
    type: Array,
    default: [
      { page: 'Home', show: true },
      { page: 'About Me', show: false },
      { page: 'Projects', show: false },
      { page: 'Contact', show: false },
      { page: 'Pereritto', show: true },
      { page: 'Maintenance', show: true },
      { page: 'Notifications', show: true },
      { page: 'Locations', show: true }
    ]
  }
});

mongoose.model('appsettings', AppSettingsSchema);
