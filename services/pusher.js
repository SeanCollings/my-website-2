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
  app.get('/api/get_pusherkey', requireLogin, (req, res) => {
    console.log(keys.pusherKey);
    res.send(keys.pusherKey);
  });

  app.post('/api/pusher_auth', requireLogin, (req, res) => {
    console.log('/api/pusher_auth');
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    console.log(socketId, channel);
    const auth = pusher.authenticate(socketId, channel);
    res.send(auth);
  });

  app.post('/api/update_location', (req, res) => {
    console.log('/api/update_location');
    // trigger a new post event via pusher
    // pusher.trigger('presence-channel', 'location-update', {
    //   username: req.body.username,
    //   location: req.body.location
    // });
    res.json({ status: 200 });
  });
};
