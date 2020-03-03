import passport from 'passport';

const requireAuth = passport.authenticate('jwt', { session: false });

const requireLogin = (req, res, next) => {
  try {
    if (!req.user) {
      const { authorization } = req.headers;
      if (authorization && authorization.length) {
        return requireAuth(req, res, next);
      }

      throw new Error(401);
    }

    next();
  } catch (err) {
    throw err;
  }
};

const requireRealUser = (req, res, next) => {
  try {
    if (req.user && req.user.tempUser) {
      throw new Error(401);
    }

    next();
  } catch (err) {
    throw err;
  }
};

export default [requireLogin, requireRealUser];
