import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

export const sendEmail = async (to, subject, text, html) => {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: '"Soccer App" <no-reply@soccerapp.com>',
    to,
    subject,
    text,
    html,
  });

  return info;
};
