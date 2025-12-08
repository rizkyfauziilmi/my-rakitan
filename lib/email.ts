import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'rizkyfauziilmi@gmail.com',
    clientId: process.env.GMAIL_GOOGLE_CLIENT_ID,
    clientSecret: process.env.GMAIL_GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_GOOGLE_REFRESH_TOKEN,
  },
});

export async function sendEmail({
  subject,
  to,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: 'rizkyfauziilmi@gmail.com',
      to: to,
      subject: subject,
      html: html,
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error('Error while sending mail', err);
  }
}
