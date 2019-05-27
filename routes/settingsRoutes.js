import requireLogin from '../middlewares/requireLogin';
import { MessageTypeEnum } from '../client/src/utils/constants';

const mongoose = require('mongoose');
const Settings = mongoose.model('settings');
const Users = mongoose.model('users');

export default app => {
  app.get('/api/get_usersettings', requireLogin, async (req, res) => {
    const settings = await Settings.findOne({ _user: req.user._id });

    if (settings === null) {
      const newSettings = await new Settings({
        _user: req.user._id
      }).save();
      return res.send(newSettings);
    }
    return res.send(settings);
  });

  app.post('/api/update_profilepic', requireLogin, async (req, res) => {
    try {
      const { option } = req.body;
      const existingSettings = await Settings.findOne(
        {
          _user: req.user._id
        },
        { _id: 1 }
      ).limit(1);

      if (existingSettings) {
        await Settings.updateOne(
          { _id: existingSettings },
          { $set: { profilePic: option } }
        );
      } else {
        await new Settings({
          profilePic: option,
          _user: req.user._id
        }).save();
      }

      res.send({
        type: MessageTypeEnum.success,
        message: `Profile picture updated!`
      });
    } catch (err) {
      console.log(err);
      res.send({
        type: MessageTypeEnum.success,
        message: 'An error occured!'
      });
    }
  });

  app.post('/api/upload_userphoto', requireLogin, async (req, res) => {
    try {
      const { dataUri } = req.body;
      const { _id } = req.user;

      await Users.updateOne({ _id }, { $set: { uploadedPhoto: dataUri } });

      const existingSettings = await Settings.findOne(
        {
          _user: req.user._id
        },
        { _id: 1 }
      ).limit(1);

      if (existingSettings) {
        await Settings.updateOne(
          { _id: existingSettings },
          { $set: { profilePic: 'profilePhoto' } }
        );
      }

      res.send({
        type: MessageTypeEnum.success,
        message: `Profile photo uploaded!`
      });
    } catch (err) {
      console.log(err);
      res.send({
        type: MessageTypeEnum.success,
        message: 'An error occured!'
      });
    }
  });
};
