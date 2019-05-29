import requireLogin from '../middlewares/requireLogin';
import { MessageTypeEnum } from '../client/src/utils/constants';

export default app => {
  app.get('/api/get_version', (req, res) => {
    const version = process.env.HEROKU_RELEASE_VERSION
      ? process.env.HEROKU_RELEASE_VERSION
      : 'v00';

    res.send({ version });
  });

  app.get('/api/get_releasecreated', requireLogin, (req, res) => {
    const releaseCreated = process.env.HEROKU_RELEASE_CREATED_AT
      ? process.env.HEROKU_RELEASE_CREATED_AT
      : new Date('2010-01-01');
    const version = process.env.HEROKU_RELEASE_VERSION
      ? process.env.HEROKU_RELEASE_VERSION
      : 'v00';

    const userLastLoggedIn = new Date(req.user.lastLogin);

    if (userLastLoggedIn < releaseCreated) {
      res.send({
        type: MessageTypeEnum.info,
        message: `App version ${version} released`
      });
    } else {
      res.send({
        type: MessageTypeEnum.none,
        message: ``
      });
    }
  });
};
