const nodemailer = require("nodemailer");
const ApiError = require("./apiError");

const getMailConfig = () => {
  const senderEmail = process.env.MAIL_USERNAME || process.env.EMAIL_USER || process.env.EMAIL;
  const senderPassword = (process.env.MAIL_PASSWORD || process.env.EMAIL_PASS)?.replace(/\s/g, "");
  const adminEmail = process.env.ADMIN_EMAIL;
  const mailHost = process.env.MAIL_HOST || "smtp.gmail.com";
  const mailPort = Number(process.env.MAIL_PORT) || 587;
  const mailEncryption = (process.env.MAIL_ENCRYPTION || "tls").toLowerCase();

  if (!senderEmail || !senderPassword || !adminEmail) {
    throw new ApiError(
      500,
      "Email service is not configured. Please set MAIL_USERNAME, MAIL_PASSWORD, and ADMIN_EMAIL."
    );
  }

  return { senderEmail, senderPassword, adminEmail, mailHost, mailPort, mailEncryption };
};

const createTransporter = () => {
  const config = getMailConfig();
  const transporter = nodemailer.createTransport({
    host: config.mailHost,
    port: config.mailPort,
    secure: config.mailEncryption === "ssl" || config.mailPort === 465,
    requireTLS: config.mailEncryption === "tls",
    auth: {
      user: config.senderEmail,
      pass: config.senderPassword,
    },
  });

  console.info(
    `Mail sender configured: ${config.senderEmail} via ${config.mailHost}:${config.mailPort}/${config.mailEncryption}, password length ${config.senderPassword.length}`
  );

  return { transporter, ...config };
};

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderMessage = (message = "") => escapeHtml(message).replace(/\n/g, "<br />");

const renderEmailLayout = ({ title, eyebrow, intro, content, footer }) => `
  <div style="margin:0;padding:0;background:#f3f6f4;font-family:Arial,Helvetica,sans-serif;color:#1f2933;">
    <div style="max-width:680px;margin:0 auto;padding:28px 14px;">
      <div style="background:#ffffff;border:1px solid #e0e7e2;border-radius:14px;overflow:hidden;">
        <div style="background:#0f6b3d;padding:26px 30px;color:#ffffff;">
          <div style="font-size:12px;letter-spacing:1.4px;text-transform:uppercase;opacity:.86;">${eyebrow}</div>
          <h1 style="margin:8px 0 0;font-size:25px;line-height:1.25;font-weight:700;">${title}</h1>
        </div>
        <div style="padding:30px;">
          <p style="margin:0 0 22px;font-size:15px;line-height:1.7;color:#374151;">${intro}</p>
          ${content}
        </div>
        <div style="padding:18px 30px;background:#f8faf9;border-top:1px solid #e5ebe7;color:#647067;font-size:12px;line-height:1.6;">
          ${footer}
        </div>
      </div>
    </div>
  </div>
`;

const renderInfoRows = (rows) => `
  <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;margin:0 0 22px;">
    ${rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="width:150px;padding:11px 0;border-bottom:1px solid #edf2ef;color:#6b766f;font-size:13px;font-weight:700;">${label}</td>
          <td style="padding:11px 0;border-bottom:1px solid #edf2ef;color:#1f2933;font-size:14px;">${value}</td>
        </tr>
      `
    )
    .join("")}
  </table>
`;

const getSubmittedAt = () =>
  new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kathmandu",
  });

const sendMailWithLog = async (transporter, options, label) => {
  const info = await transporter.sendMail(options);
  console.info(`${label} email accepted:`, info.accepted, "rejected:", info.rejected);
  return info;
};

module.exports = {
  createTransporter,
  escapeHtml,
  getSubmittedAt,
  renderEmailLayout,
  renderInfoRows,
  renderMessage,
  sendMailWithLog,
};
