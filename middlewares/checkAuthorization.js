import passport from 'passport';

const requireAuth = passport.authenticate('jwt', { session: false });

export default (req, res, next) => {
  try {
    if (!req.user) {
      const { authorization } = req.headers;
      if (authorization && authorization.length) {
        return requireAuth(req, res, next);
      }

      next();
    }

    next();
  } catch (err) {
    throw err;
  }
};
