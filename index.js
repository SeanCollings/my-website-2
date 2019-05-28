import express from 'express';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import passport from 'passport';
import bodyParser from 'body-parser';
import path from 'path';
import sslRedirect from 'heroku-ssl-redirect';

import './models/User';
import './services/passport';
import './models/PererittoUser';
import './models/WinnerDates';
import './models/Settings';
import './models/Award';
import './models/CurrentAward';
import './models/PastAward';

import keys from './config/keys';
import authRoutes from './routes/authRoutes';
import pereRoutes from './routes/pererittoRoutes';
import userRoutes from './routes/userRoutes';
import winnerRoutes from './routes/winnerRoutes';
import settingsRoutes from './routes/settingsRoutes';
import versionRoutes from './routes/versionRoute';

mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

const app = express();

/* Middlewares start */
app.use(sslRedirect());
app.use(bodyParser.json());

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
// Tell passport to make use of cookies to handle authentication
app.use(passport.initialize());
app.use(passport.session());
/* Middlewares end */

authRoutes(app);
pereRoutes(app);
userRoutes(app);
winnerRoutes(app);
settingsRoutes(app);
versionRoutes(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
