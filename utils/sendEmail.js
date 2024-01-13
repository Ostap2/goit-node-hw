const sgMail = require('@sendgrid/mail');
const { SENDGRID_API_KEY, SENDGRID_SENDER_EMAIL } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendVerificationEmail = async (email, verificationToken) => {
  const msg = {
    to: email,
    from: SENDGRID_SENDER_EMAIL,
    subject: 'Email Verification',
    text: `Click the following link to verify your email: ${process.env.BASE_URL}/users/verify/${verificationToken}`,
    html: `<p>Click the following link to verify your email:</p><p><a href="${process.env.BASE_URL}/users/verify/${verificationToken}">${process.env.BASE_URL}/users/verify/${verificationToken}</a></p>`,
  };

  await sgMail.send(msg);
};

module.exports = { sendVerificationEmail };
