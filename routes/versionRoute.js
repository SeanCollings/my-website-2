import requireLogin from '../middlewares/requireLogin';
import { MessageTypeEnum } from '../client/src/utils/constants';

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

  app.get('/api/get_releasecreated', requireLogin, (req, res) => {
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
          message: `${userLastLoggedIn} < ${releaseCreated}?`
        });
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
};
