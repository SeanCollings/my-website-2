export default (req, res, next) => {
  if (!req.user.superUser) {
    return res.status(401).send({ error: 'Access denied!' });
  }

  next();
};
