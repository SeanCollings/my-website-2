import requireLogin from '../middlewares/requireLogin';
import { MessageTypeEnum } from '../client/src/utils/constants';
import { manifest } from '../config/manifest';
import loadingMessages from '../client/src/utils/loadingMessages';

const mongoose = require('mongoose');
const Users = mongoose.model('users');
const AppSettings = mongoose.model('appsettings');

export default app => {
  app.get('/api/get_version', (req, res) => {
    try {
      const version = process.env.HEROKU_RELEASE_VERSION
        ? process.env.HEROKU_RELEASE_VERSION
        : 'v00';

      res.send({ version });
    } catch (err) {
      throw err;
    }
  });

  app.get('/api/get_releasecreated', requireLogin, async (req, res) => {
    try {
      const releaseCreated = process.env.HEROKU_RELEASE_CREATED_AT
        ? new Date(process.env.HEROKU_RELEASE_CREATED_AT)
        : new Date('2019-06-03T20:42:00Z');
      const version = process.env.HEROKU_RELEASE_VERSION
        ? process.env.HEROKU_RELEASE_VERSION
        : 'v00';

      const userLastLoggedIn = new Date(req.user.lastLogin);

      if (userLastLoggedIn < releaseCreated) {
        res.send({
          type: MessageTypeEnum.info,
          message: `App version ${version} released.`
        });
      } else {
        res.send({
          type: MessageTypeEnum.none,
          message: ``
        });
      }

      if (req.user) {
        await Users.updateOne(
          { _id: req.user._id },
          { $set: { lastLogin: Date.now() } }
        );
      }
    } catch (err) {
      throw err;
    }
  });

  app.get('/api/get_publicvapidkey', requireLogin, (req, res) => {
    try {
      const publicVapidKey = process.env.PUBLIC_VAPID_KEY
        ? process.env.PUBLIC_VAPID_KEY
        : 'BHgha8FLKBDBXtfJIJuDZbiLYtluV0mgg7l0QXhTraSt203FJAAAQpW4E018QCuWztW_qZcb_J3sKjd-RB_-nYw';

      res.send(publicVapidKey);
    } catch (err) {
      throw err;
    }
  });

  app.get('/api/get_manifest', (req, res) => {
    const message =
      loadingMessages[Math.floor(Math.random() * loadingMessages.length)] ||
      'Pure Seanography';

    res.send(manifest(message));
  });

  app.get('/api/get_settings', async (req, res) => {
    try {
      const settings = await AppSettings.find();
      return res.send(settings[0]);
    } catch (err) {
      throw err;
    }
  });

  app.put('/api/update_pages', requireLogin, async (req, res) => {
    try {
      const { pages } = req.body;
      await AppSettings.updateMany({}, { $set: { pages } });

      return res.send({
        type: MessageTypeEnum.success,
        message: `Pages updated successfully!`
      });
    } catch (err) {
      console.log(err);
    }
  });
};
