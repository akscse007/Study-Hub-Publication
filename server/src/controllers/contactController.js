import { sendContactNotification } from "../utils/emailService.js";

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "A valid email is required" });
    }

    await sendContactNotification({ name, email, message });

    return res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("[Contact] Failed to send Contact Us notification:");
    console.error(error.stack);
    return next(error);
  }
};
