import Subscriber from "../models/Subscriber.js";
import { sendSubscriberConfirmation, notifySubscribersAboutBook as sendBookReleaseEmails } from "../utils/emailService.js";

const clients = new Set();

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

    try {
      await sendSubscriberConfirmation(email);
    } catch (emailError) {
      console.error(`[Subscriber] Subscription saved for ${email}, but confirmation email failed:`);
      console.error(emailError.stack);
    }

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

    await sendBookReleaseEmails(book, subscribers);
  } catch (error) {
    console.error(`[Subscriber] Failed to notify subscribers about new book "${book.title}":`);
    console.error(error.stack);
  }
};
