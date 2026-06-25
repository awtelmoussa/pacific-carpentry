import nodemailer from 'nodemailer';

export interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendMail({ to, subject, text, html }: MailOptions) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.FROM_EMAIL || 'no-reply@pacificcarpentry.ae';

  console.log(`[Email Notification Triggered]`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Content:\n${text}`);

  if (!host || !user || !pass) {
    console.log(`[Email Notification Status] Mock email logged. (Define SMTP_HOST, SMTP_USER, SMTP_PASS in .env for real emails)`);
    return { success: true, mock: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"Pacific Carpentry" <${from}>`,
      to,
      subject,
      text,
      html: html || text.replace(/\n/g, '<br>'),
    });

    console.log(`[Email Notification Status] Real email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email Notification Status] Failed to send real email:`, error);
    return { success: false, error };
  }
}
