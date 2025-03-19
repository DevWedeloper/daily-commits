import { createTransport } from 'nodemailer';

export const sendEmail = async () => {
  const transporter = createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_SENDER,
    to: 'vicnathangabrielle@gmail.com',
    subject: 'Reminder: Commit Today',
    text: 'You have not committed today yet. Please remember to make your commit!',
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent: Commit reminder');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
