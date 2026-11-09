import type { WaitlistEntry } from "../data/types";

export const WAITLIST_EMAIL = "simplyallan@outlook.com";

const ENDPOINT = `https://formsubmit.co/ajax/${WAITLIST_EMAIL}`;

export interface WaitlistPayload {
  name: string;
  email: string;
  linkedin: string;
  interest: string;
  source: string;
}

function toBody(entry: WaitlistPayload): Record<string, string> {
  return {
    _subject: `Percebera | Lista de espera: ${entry.name || entry.email}`,
    _template: "table",
    _captcha: "false",
    _replyto: entry.email,
    Nome: entry.name || "Não indicado",
    Email: entry.email,
    LinkedIn: entry.linkedin || "Não indicado",
    Interesse: entry.interest,
    Origem: entry.source,
    Data: new Date().toLocaleString("pt-MZ"),
    Nota: "Inscrição recebida no site da Percebera.",
  };
}

export async function sendWaitlistNotification(payload: WaitlistPayload): Promise<void> {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(toBody(payload)),
  });

  if (!response.ok) {
    throw new Error(`O serviço de email respondeu com o estado ${response.status}.`);
  }

  const result = (await response.json().catch(() => null)) as
    | { success?: boolean | string; message?: string }
    | null;

  const success = result?.success === true || result?.success === "true";
  if (!success) {
    throw new Error(result?.message || "O serviço de email não confirmou o envio.");
  }
}

export function waitlistMailto(payload: WaitlistPayload): string {
  const subject = `Percebera | Lista de espera: ${payload.name || payload.email}`;
  const body = [
    "Nova inscrição na lista de espera da Percebera",
    "",
    `Nome: ${payload.name || "Não indicado"}`,
    `Email: ${payload.email}`,
    `LinkedIn: ${payload.linkedin || "Não indicado"}`,
    `Interesse: ${payload.interest}`,
    `Origem: ${payload.source}`,
    `Data: ${new Date().toLocaleString("pt-MZ")}`,
  ].join("\n");
  return `mailto:${WAITLIST_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function entryToPayload(entry: WaitlistEntry): WaitlistPayload {
  return {
    name: entry.name,
    email: entry.email,
    linkedin: entry.linkedin,
    interest: entry.interest,
    source: entry.source,
  };
}
