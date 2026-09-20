import { readFileSync } from "node:fs";
import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST?.trim();
const port = Number(process.env.SMTP_PORT ?? 587);
const secure = process.env.SMTP_SECURE === "true";
const user = process.env.SMTP_USER?.trim();
function readSmtpPassword(): string | undefined {
  const direct = process.env.SMTP_PASSWORD?.trim();
  if (direct) return direct;

  const file = process.env.SMTP_PASSWORD_FILE?.trim();
  if (!file) return undefined;

  try {
    const value = readFileSync(file, "utf8").trim();
    return value || undefined;
  } catch {
    return undefined;
  }
}

const password = readSmtpPassword();
const from = process.env.MAIL_FROM?.trim();
const appBaseUrl = (process.env.APP_BASE_URL ?? "https://dev.terra-umbra.fr").replace(/\/$/, "");

export function passwordResetMailAvailable(): boolean {
  return Boolean(host && user && password && from);
}

function createTransporter() {
  if (!host || !user || !password) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass: password
    }
  });
}

export async function verifyPasswordResetMail(): Promise<void> {
  const transporter = createTransporter();
  if (!transporter || !from) {
    throw new Error("SMTP configuration is incomplete");
  }

  await transporter.verify();
}

export async function sendPasswordResetEmail(
  email: string,
  displayName: string,
  token: string
): Promise<boolean> {
  const transporter = createTransporter();
  if (!transporter || !from) return false;

  const resetUrl = `${appBaseUrl}/account?reset=${encodeURIComponent(token)}`;

  await transporter.sendMail({
    from,
    to: email,
    subject: "Réinitialisation de votre mot de passe Terra Umbra",
    text: [
      `Bonjour ${displayName},`,
      "",
      "Une demande de réinitialisation de votre mot de passe Terra Umbra a été reçue.",
      "",
      `Ouvrez ce lien pour choisir un nouveau mot de passe : ${resetUrl}`,
      "",
      "Ce lien expire dans 30 minutes et ne peut être utilisé qu’une seule fois.",
      "Si vous n’êtes pas à l’origine de cette demande, ignorez simplement ce message."
    ].join("\n"),
    html: `
      <p>Bonjour ${escapeHtml(displayName)},</p>
      <p>Une demande de réinitialisation de votre mot de passe Terra Umbra a été reçue.</p>
      <p><a href="${escapeHtml(resetUrl)}">Choisir un nouveau mot de passe</a></p>
      <p>Ce lien expire dans 30 minutes et ne peut être utilisé qu’une seule fois.</p>
      <p>Si vous n’êtes pas à l’origine de cette demande, ignorez simplement ce message.</p>
    `
  });

  return true;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return entities[character] ?? character;
  });
}
