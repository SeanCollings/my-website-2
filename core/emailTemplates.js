let url;
if (process.env.NODE_ENV === 'production') {
  url = 'https://seancollings.herokuapp.com';
} else {
  url = 'http://localhost:3000';
}

const logo = `<div
    style="color: #ffc300;
    background: #900c3f;
    height: 96px;
    width: 96px;
    line-height: 96px;
    font-family: 'Knewave';
    font-size: 60px;
    border-radius: 100%;
    text-align: center;
    margin: auto;
    margin-top: 24px;"
    >
      SC
    </div>`;

const htmlTemplate = (title, heading, explanation, action, token) => `<html>
  <head>
    <title${title}</title>
    <link rel="shortcut icon" type="image/x-icon" href="icons/favicon.ico" />
    <link rel="icon" href="./icons/favicon.ico" type="image/ico"/>
    <link href='https://fonts.googleapis.com/css?family=Knewave:400,700' rel='stylesheet' type='text/css'>
    <meta name="theme-color" content="#581845" />
  </head>
  <body
    style="text-align: center;
    background-repeat: no-repeat;
        background-image: linear-gradient(155deg, rgb(88, 24, 69), rgb(144, 12, 63), rgb(191, 35, 35));
    "
    >
    ${logo}
    <div style="font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif; color: #dedede;">
      <h2>${heading}</h2>
      <div>
        ${explanation}
      </div>
      <div style="margin-bottom: 24px;">
      ${action}
      </div>
      <a
        onclick="${token ? `localStorage.setItem('token', '${token}')` : null}"
        href="${url}"
        style="text-decoration: none;
        background-color: #ff4136;
        color: white;
        font-weight: 500;
        cursor: pointer;
        padding: 8px 54px 8px 54px;
        border-radius: 4px;
        box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2),
        0px 2px 2px 0px rgba(0, 0, 0, 0.14),
        0px 3px 1px -2px rgba(0, 0, 0, 0.12);"
        >
        Continue to app
      </a>
    </div>
  </body>
  </html>`;

export const htmlNoUser = htmlTemplate(
  'User not found',
  'User not found',
  'Sorry, that user does not exist.',
  'Please re-sign up in the app and verify your email address again to continue.'
);

export const htmlUserAlreadyVerified = htmlTemplate(
  'Acount verified',
  'This account has been verified',
  'Head on over to the app and login with your credentials.',
  `You're good to go!`
);

export const htmlUserVerified = token =>
  htmlTemplate(
    'Acount verified',
    `Success!`,
    `You've successfully verified your account!`,
    `Head on over to the app and login with your credentials.`,
    token
  );
