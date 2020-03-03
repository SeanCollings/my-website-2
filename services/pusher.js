import requireLogin from '../middlewares/requireLogin';
import Pusher from 'pusher';
import keys from '../config/keys';

const pusher = new Pusher({
  appId: keys.pusherAppId,
  key: keys.pusherKey,
  secret: keys.pusherSecret,
  cluster: keys.pusherCluster,
  useTLS: true
});

// pusher.trigger('my-channel', 'my-event', {
//   message: 'hello world again amore'
// });

export default app => {
  app.get('/api/get_pushercreds', requireLogin, (req, res) => {
    try {
      res.send({ pusherKey: keys.pusherKey, cluster: keys.pusherCluster });
    } catch (err) {
      throw err;
    }
  });

  app.post('/api/pusher_auth', requireLogin, (req, res) => {
    try {
      console.log('/api/pusher_auth', req.query.random);
      const username = `${req.user.givenName} ${req.user.familyName}`;
      const socketId = req.body.socket_id;
      const channel = req.body.channel_name;
      const presenceData = {
        // user_id: req.user._id,
        // user_info: {
        //   username: '@' + username
        user_id: req.query.random,
        user_info: {
          username: '@' + username
        }
      };

      const auth = pusher.authenticate(socketId, channel, presenceData);
      res.send(auth);
    } catch (err) {
      throw err;
    }
  });

  app.post('/api/update_location', requireLogin, (req, res) => {
    try {
      // trigger a new post event via pusher
      console.log('/api/update_location');
      const groupName = `presence-${req.body.groupId.toString()}`;
      pusher.trigger(groupName, 'location-update', {
        userId: req.body.userId,
        username: req.body.username,
        location: req.body.location,
        blurred: req.body.blurred
      });
      res.json({ status: 200 });
    } catch (err) {
      throw err;
    }
  });
};
