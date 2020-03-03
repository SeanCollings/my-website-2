import express from 'express';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import passport from 'passport';
import bodyParser from 'body-parser';
import path from 'path';
import sslRedirect from 'heroku-ssl-redirect';
import cors from 'cors';
import webPush from 'web-push';
import keys from './config/keys';

import './models/User';
import './models/TempUser';
import './models/PererittoUser';
import './models/WinnerDates';
import './models/Settings';
import './models/Award';
import './models/CurrentAward';
import './models/PastAward';
import './models/Subscriptions';
import './models/NotificationGroup';
import './models/LocationGroup';
import './models/AppSettings';
import './models/PereryvUser';
import './models/Slate';
import './models/QuizGroup';
import './models/QuizContent';
import './models/QuizRound';
import './services/passport';

import authRoutes from './routes/authRoutes';
import pereRoutes from './routes/pererittoRoutes';
import userRoutes from './routes/userRoutes';
import winnerRoutes from './routes/winnerRoutes';
import settingsRoutes from './routes/settingsRoutes';
import appRoutes from './routes/appRoutes';
import awardRoutes from './routes/awardRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import notificationRoutes from './routes/notificationRoutes';
import pusher from './services/pusher';
import locationRoutes from './routes/locationRoutes';
import pereryvRoutes from './routes/pereryvRoutes';
import quizRoutes from './routes/quizRoutes';

const mongooseParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose.connect(keys.mongoURI, mongooseParams).catch(err => {
  new Error(err);
});

let db = mongoose.connection;

// db.on(
//   'error',
//   console.error.bind(console, 'error connecting with mongodb database:')
// );
db.once('open', () => {
  console.log('connected to mongodb database');
});
db.on('disconnected', () => {
  //Reconnect on timeout
  mongoose.connect(keys.mongoURI, mongooseParams).catch(err => {
    new Error(err);
  });
  db = mongoose.connection;
});

webPush.setVapidDetails(
  'mailto:nightharrier@gmail.com',
  keys.publicVapidKey,
  keys.privateVapidKey
);

const app = express();

/* Middlewares start */
if (process.env.NODE_ENV !== 'production') {
  app.use(cors());
}
app.use(sslRedirect());
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }));

app.use(
  cookieSession({
    maxAge: 10 * 365 * 24 * 60 * 60 * 1000, // 10 years expire
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
appRoutes(app);
awardRoutes(app);
subscriptionRoutes(app);
notificationRoutes(app);
pusher(app);
locationRoutes(app);
pereryvRoutes(app);
quizRoutes(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
