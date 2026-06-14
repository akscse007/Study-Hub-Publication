import nodemailer from "nodemailer";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ADMIN_EMAIL, CLIENT_URL } = process.env;

const createTransporter = () => {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error("[SMTP] Missing required environment variables. Expected SMTP_HOST, SMTP_USER, SMTP_PASS.");
    return null;
  }

  const port = Number(SMTP_PORT) || 587;
  const secure = port === 465;
  const requireTLS = port === 587;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure,
    requireTLS,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
};

const transporter = createTransporter();

export const verifySmtpConnection = async () => {
  if (!transporter) {
    console.error("[SMTP] Cannot verify connection: transporter not created. Check your SMTP environment variables.");
    return false;
  }

  try {
    const success = await transporter.verify();
    console.log(`[SMTP] Connection verified successfully: ${SMTP_HOST}:${SMTP_PORT || 587} (secure=${SMTP_PORT === "465"}, requireTLS=${SMTP_PORT === "587" || SMTP_PORT === undefined})`);
    return success;
  } catch (error) {
    console.error(`[SMTP] Connection verification failed for ${SMTP_HOST}:${SMTP_PORT || 587}`);
    console.error(`[SMTP] Error message: ${error.message}`);
    console.error(`[SMTP] Error code: ${error.code || "N/A"}`);
    console.error(`[SMTP] Error response: ${error.response || "N/A"}`);
    console.error(`[SMTP] Error response code: ${error.responseCode || "N/A"}`);
    console.error(`[SMTP] Stack trace:\n${error.stack}`);
    return false;
  }
};

export const sendEmail = async ({ to, bcc, subject, html, text, from, replyTo }) => {
  if (!transporter) {
    const error = new Error(
      "SMTP is not configured. Verify that SMTP_HOST, SMTP_USER, and SMTP_PASS are set in server/.env and that dotenv loaded before this module was imported."
    );
    console.error(`[SMTP] ${error.message}`);
    throw error;
  }

  try {
    const info = await transporter.sendMail({
      from: from || `"Study-Hub Publication" <${SMTP_USER}>`,
      to,
      bcc,
      replyTo,
      subject,
      html,
      text
    });
    console.log(`[SMTP] Email sent successfully. MessageId: ${info.messageId}; Accepted: ${info.accepted.join(", ") || "N/A"}; Rejected: ${info.rejected.join(", ") || "N/A"}`);
    return info;
  } catch (error) {
    console.error(`[SMTP] Failed to send email to ${to || bcc}`);
    console.error(`[SMTP] Error message: ${error.message}`);
    console.error(`[SMTP] Error code: ${error.code || "N/A"}`);
    console.error(`[SMTP] Error response: ${error.response || "N/A"}`);
    console.error(`[SMTP] Error response code: ${error.responseCode || "N/A"}`);
    console.error(`[SMTP] Stack trace:\n${error.stack}`);
    throw error;
  }
};

export const sendContactNotification = async ({ name, email, message }) => {
  const recipient = ADMIN_EMAIL || SMTP_USER;
  const subject = `New Contact Us message from ${name}`;
  const html = `
    <h2>New Contact Us Submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
  `;
  const text = `New Contact Us Submission\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`;

  return sendEmail({ to: recipient, replyTo: email, subject, html, text });
};

export const sendSubscriberConfirmation = async (email) => {
  const subject = "Welcome to Study-Hub Publication notifications";
  const siteUrl = CLIENT_URL || "http://localhost:5173";
  const html = `
    <h2>You are subscribed!</h2>
    <p>Thank you for subscribing to Study-Hub Publication. You will be notified by email whenever a new book is released.</p>
    <p><a href="${siteUrl}/books">Browse all books</a></p>
  `;
  const text = `You are subscribed! Thank you for subscribing to Study-Hub Publication. Browse all books: ${siteUrl}/books`;

  return sendEmail({ to: email, subject, html, text });
};

export const notifySubscribersAboutBook = async (book, subscribers) => {
  if (!subscribers || subscribers.length === 0) return;

  const subject = `New release: ${book.title}`;
  const siteUrl = CLIENT_URL || "http://localhost:5173";
  const html = `
    <h2>A new book is available at Study-Hub Publication</h2>
    <p><strong>${escapeHtml(book.title)}</strong> by ${escapeHtml(book.author)} has just been released.</p>
    <p>Category: ${escapeHtml(book.category)}</p>
    <p><a href="${siteUrl}/books">Browse all books</a></p>
  `;
  const text = `A new book is available at Study-Hub Publication: "${book.title}" by ${book.author}. Category: ${book.category}. Browse: ${siteUrl}/books`;

  return sendEmail({
    bcc: subscribers.map((s) => s.email).join(","),
    subject,
    html,
    text
  });
};

function escapeHtml(text) {
  if (typeof text !== "string") return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export { transporter };
