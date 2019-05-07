import requireLogin from '../middlewares/requireLogin';

export default app => {
  app.get('/api/pereritto', requireLogin, (req, res) => {
    res.sendStatus(200);
  });
};
