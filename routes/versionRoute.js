export default app => {
  app.get('/api/get_version', (req, res) => {
    const version = process.env.HEROKU_RELEASE_VERSION
      ? process.env.HEROKU_RELEASE_VERSION
      : 'v00';

    res.send({ version });
  });
};
