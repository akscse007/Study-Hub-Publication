import "../config/network.js";
import "dotenv/config";
import nodemailer from "nodemailer";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

console.log("=== SMTP Diagnostic Test ===");
console.log("Environment:");
console.log(`  SMTP_HOST: ${SMTP_HOST || "NOT SET"}`);
console.log(`  SMTP_PORT: ${SMTP_PORT || "NOT SET"}`);
console.log(`  SMTP_USER: ${SMTP_USER || "NOT SET"}`);
console.log(`  SMTP_PASS: ${SMTP_PASS ? "***REDACTED***" : "NOT SET"}`);

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  console.error("\nERROR: Missing one or more required SMTP environment variables (SMTP_HOST, SMTP_USER, SMTP_PASS).");
  console.error("Ensure server/.env is populated and that you are running this script from the server directory.");
  process.exit(1);
}

const port = Number(SMTP_PORT) || 587;
const secure = port === 465;
const requireTLS = port === 587;

console.log(`\nConfiguration:`);
console.log(`  Host: ${SMTP_HOST}`);
console.log(`  Port: ${port}`);
console.log(`  Secure: ${secure}`);
console.log(`  Require TLS: ${requireTLS}`);
console.log(`  Auth user: ${SMTP_USER}`);

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port,
  secure,
  requireTLS,
  auth: { user: SMTP_USER, pass: SMTP_PASS }
});

try {
  console.log("\nVerifying SMTP connection...");
  await transporter.verify();
  console.log("SMTP connection verified successfully.");
} catch (error) {
  console.error("\nSMTP verification failed:");
  console.error(`  Message: ${error.message}`);
  console.error(`  Code: ${error.code || "N/A"}`);
  console.error(`  Response: ${error.response || "N/A"}`);
  console.error(`  Response code: ${error.responseCode || "N/A"}`);
  console.error(`  Stack:\n${error.stack}`);
  process.exit(1);
}

const recipient = process.argv[2] || SMTP_USER;

console.log(`\nSending test email to: ${recipient}`);

try {
  const info = await transporter.sendMail({
    from: `"Study-Hub Publication" <${SMTP_USER}>`,
    to: recipient,
    subject: "SMTP Test Email",
    text: "This is a test email from the Study-Hub Publication SMTP diagnostic script.",
    html: "<h2>SMTP Test</h2><p>This is a test email from the Study-Hub Publication SMTP diagnostic script.</p>"
  });

  console.log("\nTest email sent successfully:");
  console.log(`  MessageId: ${info.messageId}`);
  console.log(`  Accepted: ${info.accepted.join(", ") || "N/A"}`);
  console.log(`  Rejected: ${info.rejected.join(", ") || "N/A"}`);
  console.log(`  Response: ${info.response}`);
} catch (error) {
  console.error("\nFailed to send test email:");
  console.error(`  Message: ${error.message}`);
  console.error(`  Code: ${error.code || "N/A"}`);
  console.error(`  Response: ${error.response || "N/A"}`);
  console.error(`  Response code: ${error.responseCode || "N/A"}`);
  console.error(`  Stack:\n${error.stack}`);
  process.exit(1);
}
