import { createTransport } from 'nodemailer'
import env from '../env'

export async function sendEmail() {
  const transporter = createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  })

  const mailOptions = {
    from: env.SMTP_SENDER,
    to: 'vicnathangabrielle@gmail.com',
    subject: 'Reminder: Commit Today',
    text: 'You have not committed today yet. Please remember to make your commit!',
  }

  try {
    await transporter.sendMail(mailOptions)
    // eslint-disable-next-line no-console
    console.log('Email sent: Commit reminder')
  }
  catch (error) {
    console.error('Error sending email:', error)
  }
}
