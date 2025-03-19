import { describe, expect, it, mock, spyOn } from 'bun:test';
import { sendEmail } from './send-email';

describe('sendEmail', () => {
  it('should send an email successfully', async () => {
    const consoleLogSpy = spyOn(console, 'log');

    mock.module('nodemailer', () => ({
      createTransport: () => ({
        sendMail: mock(() => Promise.resolve('Email sent')),
      }),
    }));

    await sendEmail();
    expect(consoleLogSpy).toHaveBeenCalledWith('Email sent: Commit reminder');
  });

  it('should log an error if email sending fails', async () => {
    const consoleErrorSpy = spyOn(console, 'error').mockImplementation(
      () => {}
    );

    mock.module('nodemailer', () => ({
      createTransport: () => ({
        sendMail: mock(() => Promise.reject(new Error('SMTP Error'))),
      }),
    }));

    await sendEmail();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error sending email:',
      expect.any(Error)
    );
  });
});
