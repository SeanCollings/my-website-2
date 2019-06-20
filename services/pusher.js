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
    res.send({ pusherKey: keys.pusherKey, cluster: keys.pusherCluster });
  });

  app.post('/api/pusher_auth', requireLogin, (req, res) => {
    console.log('/api/pusher_auth');
    let random_string = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substr(0, 5);
    const username = `${req.user.givenName} ${req.user.familyName}`;
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    const presenceData = {
      // user_id: req.user._id,
      // user_info: {
      //   username: '@' + username
      user_id: random_string,
      user_info: {
        username: '@' + random_string
      }
    };

    const auth = pusher.authenticate(socketId, channel, presenceData);
    res.send(auth);
  });

  app.post('/api/update_location', (req, res) => {
    // trigger a new post event via pusher
    console.log('/api/update_location');
    const groupName = `presence-${req.body.groupId.toString()}`;
    pusher.trigger(groupName, 'location-update', {
      userId: req.body.userId,
      username: req.body.username,
      location: req.body.location
    });
    res.json({ status: 200 });
  });
};
