const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not configured.");
}

let eventSource = null;

export const connectNotificationStream = () => {
  if (eventSource) return;

  eventSource = new EventSource(`${API_BASE_URL}/notifications/stream`);

  eventSource.addEventListener("books-updated", () => {
    window.dispatchEvent(new CustomEvent("studyhub:books-updated"));
  });

  eventSource.addEventListener("new-book", (event) => {
    try {
      const data = JSON.parse(event.data);
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        new Notification(data.title || "Study-Hub Publication", {
          body: data.message || "A new book has been released.",
          icon: "/favicon.ico"
        });
      }
    } catch {
      // ignore malformed events
    }
  });

  eventSource.addEventListener("error", () => {
    eventSource.close();
    eventSource = null;
    setTimeout(connectNotificationStream, 5000);
  });
};

export const subscribeEmail = async (email) => {
  const res = await fetch(`${API_BASE_URL}/notifications/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Subscription failed");
  return data;
};
