import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';
import keys from '../config/keys';

let url;
if (process.env.NODE_ENV === 'production') {
  url = 'https://seancollings.herokuapp.com';
} else {
  url = 'http://localhost:5000';
}

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: keys.sendgridKey
    }
  })
);

const htmlTemplate = (emailAddress, verificationString) => `<html>
<head>
<link href='https://fonts.googleapis.com/css?family=Knewave:400,700' rel='stylesheet' type='text/css'>
</head>
<body>
    <div
      id="outer-container"
      style="
    text-align: center;
    background-color: #eeeeee;
    padding: 4% 6%;"
    >
      <div
        id="inner-container"
        style="
      margin: auto;
      padding-top: 12px;
      background-color: rgb(88, 24, 69);
      background-image: linear-gradient(
        155deg,
        rgb(88, 24, 69),
        rgb(144, 12, 63),
        rgb(191, 35, 35)
      );"
      >
      <div
      id="logo"
      style="color: #ffc300;
    background: #900c3f;
    height: 96px;
    width: 96px;
    margin:auto;
    line-height: 96px;
    font-family: 'Knewave';
    font-size: 54px;
    border-radius: 100%;
    border: 1px solid #ffc300;"
    >
      SC
    </div>
        <div
          id="line"
          style="width: 100%;
        border-bottom: 2px solid #eeeeee;
        padding-top: 12px;"
        ></div>
        <div id="welcome_top" style="color: #ffc300; padding-top: 12px; font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;">
          Pure Seanography
        </div>
        <div id="welcome_bottom" style="color: #ffc300; padding-top: 4px; font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;">
          welcomes you
        </div>
        <h2
          style="padding-top: 24px;
        max-width: 90%;
        margin: auto;
        color: #dedede;
        font-weight: 400;
        line-height: 1.33;
        letter-spacing: 0em;
        font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;"
        >
          Verify your email address to continue
        </h2>
        <div id="link-style" style="margin-top: 36px; padding-bottom: 36px">
          <a
          href="${url}/api/verify?email=${emailAddress}&id=${verificationString}"
          id="link"
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
          target="_blank"
          >
          Verify
          </a>
        </div>
      </div>
      <div
        id="footer"
        style="text-align: center;
      color: #7f7f7f;
      padding-top: 24px;
      font-size: 12px;"
      >
        © 2020 Sean Collings. All Rights Reserved.
      </div>
    </div>
  </body>
</html>
`;

export default (emailAddress, givenName, verificationString) =>
  transporter.sendMail({
    to: emailAddress,
    from: 'noreply@seancollings.herokuapp.com',
    subject: `Welcome, ${givenName}! Verify Your Email`,
    html: htmlTemplate(emailAddress, verificationString)
  });
