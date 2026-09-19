import { verifyPasswordResetMail } from "./mail.js";

await verifyPasswordResetMail();
console.log("SMTP verify OK");
