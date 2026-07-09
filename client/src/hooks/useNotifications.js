import { useState, useCallback } from "react";
import { subscribeEmail as subscribeEmailApi } from "../services/notifications";

export const useNotifications = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const subscribeEmail = useCallback(async () => {
    setStatus("loading");
    setMessage("");
    try {
      await subscribeEmailApi(email);
      setStatus("success");
      setMessage("You’re subscribed!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  }, [email]);

  return {
    email,
    setEmail,
    status,
    message,
    subscribeEmail
  };
};
