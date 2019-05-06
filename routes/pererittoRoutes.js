import requireLogin from '../middlewares/requireLogin';

export default app => {
  app.get('/api/pereritto', requireLogin, (req, res) => {
    console.log(req, res);
    res.redirect('/pereritto');
  });
};
