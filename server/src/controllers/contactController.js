import { sendContactNotification } from "../utils/emailService.js";
import { asString } from "../utils/sanitize.js";

export const submitContact = async (req, res, next) => {
  try {
    const name = asString(req.body?.name, 120);
    const email = asString(req.body?.email, 200);
    const message = asString(req.body?.message, 5000);

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
