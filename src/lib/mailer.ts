import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: process.env.MAILHOG_HOST || 'localhost',
  port: Number(process.env.MAILHOG_PORT) || 1025,
  secure: false,
  auth:
    process.env.MAILHOG_USER && process.env.MAILHOG_PASS
      ? {
          user: process.env.MAILHOG_USER,
          pass: process.env.MAILHOG_PASS,
        }
      : undefined,
});

export async function sendResetEmail({ to, resetUrl }: { to: string; resetUrl: string }) {
    const info = await transport.sendMail({
        from: process.env.EMAIL_FROM || 'no-reply@local.test',
        to,
        subject: 'Your password reset link',
        text: `Click here to reset your password: ${resetUrl}`,
        html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });

    return info;
}