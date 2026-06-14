import nodemailer from "nodemailer";
import Subscriber from "../models/Subscriber.js";

const clients = new Set();

const createTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: (Number(SMTP_PORT) || 587) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
};

export const subscribeToNotifications = (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  const client = { res };
  clients.add(client);

  res.write(`event: connected\ndata: ${JSON.stringify({ message: "Notifications enabled" })}\n\n`);

  req.on("close", () => {
    clients.delete(client);
  });
};

export const addSubscriber = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "A valid email is required" });
    }
    await Subscriber.findOneAndUpdate({ email }, { email }, { upsert: true, new: true });
    return res.status(201).json({ message: "Subscribed successfully" });
  } catch (error) {
    return next(error);
  }
};

export const broadcastNotification = (event, data) => {
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  clients.forEach((client) => {
    try {
      client.res.write(message);
    } catch (error) {
      clients.delete(client);
    }
  });
};

export const notifySubscribersAboutBook = async (book) => {
  try {
    const subscribers = await Subscriber.find().lean();
    if (!subscribers.length) return;

    const transporter = createTransporter();
    const subject = `New release: ${book.title}`;
    const html = `
      <h2>A new book is available at Study-Hub Publication</h2>
      <p><strong>${book.title}</strong> by ${book.author} has just been released.</p>
      <p>Category: ${book.category}</p>
      <p><a href="${process.env.CLIENT_URL}/books">Browse all books</a></p>
    `;

    if (!transporter) {
      console.log(`[Email notification - no SMTP configured] ${subject}`);
      console.log(`Recipients: ${subscribers.map((s) => s.email).join(", ")}`);
      return;
    }

    await transporter.sendMail({
      from: `"Study-Hub Publication" <${process.env.SMTP_USER}>`,
      bcc: subscribers.map((s) => s.email).join(","),
      subject,
      html
    });
  } catch (error) {
    console.error("Failed to notify subscribers:", error.message);
  }
};
