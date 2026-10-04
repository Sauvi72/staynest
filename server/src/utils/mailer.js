import nodemailer from 'nodemailer';
import { getNewBookingTemplate, getBookingStatusTemplate } from '../templates/emailTemplates.js';

let transporter = null;

/**
 * Initializes and returns a singleton nodemailer transporter.
 * Uses Ethereal test account in development if custom SMTP is not set.
 */
export const getTransporter = async () => {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch {
      transporter = {
        sendMail: async (options) => {
          console.log('[Dev Mailer] Simulated email sent to:', options.to);
          return { messageId: 'simulated-' + Date.now() };
        },
      };
    }
  }

  return transporter;
};

/**
 * Sends notification email to host when a new booking request is created.
 * Non-blocking: catches internal errors so API response is never disrupted.
 */
export const sendNewBookingEmail = async ({ booking, listing, guest, host }) => {
  try {
    if (!host?.email) return;
    const mailer = await getTransporter();
    const html = getNewBookingTemplate({ booking, listing, guest, host });

    const info = await mailer.sendMail({
      from: '"StayNest" <no-reply@staynest.dev>',
      to: host.email,
      subject: `New Booking Request: ${listing.title}`,
      html,
    });

    if (nodemailer.getTestMessageUrl && info) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) console.log('Host Email Preview:', previewUrl);
    }
    return info;
  } catch (err) {
    console.error('Non-blocking error sending new booking email:', err.message);
  }
};

/**
 * Sends notification email to guest when booking status is updated (confirmed/cancelled/declined).
 * Non-blocking: catches internal errors so API response is never disrupted.
 */
export const sendBookingStatusEmail = async ({ booking, status }) => {
  try {
    const guestEmail = booking.guest?.email;
    if (!guestEmail) return;

    const mailer = await getTransporter();
    const html = getBookingStatusTemplate({ booking, status });
    const isConfirmed = status === 'confirmed';
    const subject = isConfirmed
      ? `Booking Confirmed: ${booking.listing?.title}`
      : `Booking Update: Request for ${booking.listing?.title} was declined`;

    const info = await mailer.sendMail({
      from: '"StayNest" <no-reply@staynest.dev>',
      to: guestEmail,
      subject,
      html,
    });

    if (nodemailer.getTestMessageUrl && info) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) console.log('Guest Email Preview:', previewUrl);
    }
    return info;
  } catch (err) {
    console.error(`Non-blocking error sending ${status} email:`, err.message);
  }
};
