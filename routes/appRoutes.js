import requireLogin from '../middlewares/requireLogin';
import { MessageTypeEnum } from '../client/src/utils/constants';
import { manifest } from '../config/manifest';
import loadingMessages from '../client/src/utils/loadingMessages';
import to from '../core/to';

const mongoose = require('mongoose');
const Users = mongoose.model('users');
const AppSettings = mongoose.model('appsettings');

export const getLastReleaseCreatedDate = () => {
  const releaseCreated = process.env.HEROKU_RELEASE_CREATED_AT
    ? new Date(process.env.HEROKU_RELEASE_CREATED_AT)
    : new Date('2019-06-03T20:42:00Z');

  return releaseCreated;
};

export default app => {
  app.get('/api/get_version', (req, res) => {
    const version = process.env.HEROKU_RELEASE_VERSION
      ? process.env.HEROKU_RELEASE_VERSION
      : 'v00';

    res.send({ version });
  });

  app.get('/api/get_releasecreated', requireLogin, async (req, res) => {
    let err;

    const version = process.env.HEROKU_RELEASE_VERSION
      ? process.env.HEROKU_RELEASE_VERSION
      : 'v00';

    const userLastLoggedIn = new Date(req.user.lastLogin);
    if (userLastLoggedIn < getLastReleaseCreatedDate()) {
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
      [err] = await to(
        Users.updateOne(
          { _id: req.user._id },
          { $set: { lastLogin: Date.now() } }
        )
      );
      if (err) throw new Error(err);
    }
  });

  app.get('/api/get_publicvapidkey', requireLogin, (req, res) => {
    const publicVapidKey = process.env.PUBLIC_VAPID_KEY
      ? process.env.PUBLIC_VAPID_KEY
      : 'BHgha8FLKBDBXtfJIJuDZbiLYtluV0mgg7l0QXhTraSt203FJAAAQpW4E018QCuWztW_qZcb_J3sKjd-RB_-nYw';

    res.send(publicVapidKey);
  });

  app.get('/api/get_manifest', (req, res) => {
    const message =
      loadingMessages[Math.floor(Math.random() * loadingMessages.length)] ||
      'Pure Seanography';

    res.send(manifest(message));
  });

  app.get('/api/get_settings', async (req, res) => {
    let err, settings;

    [err, settings] = await to(AppSettings.find());
    if (err) throw new Error(err);

    return res.send(settings[0]);
  });

  app.put('/api/update_pages', requireLogin, async (req, res) => {
    let err;
    const { pages } = req.body;

    [err] = await to(AppSettings.updateMany({}, { $set: { pages } }));
    if (err) throw new Error(err);

    return res.send({
      type: MessageTypeEnum.success,
      message: `Pages updated successfully!`
    });
  });
};
