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
