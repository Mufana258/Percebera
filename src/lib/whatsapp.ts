import type { Person } from "../data/types";

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
}

export function whatsappHandle(person: Person): string {
  const custom = person.whatsappUsername?.trim().replace(/^@/, "");
  return custom || slugify(person.name);
}

export function whatsappMessage(person: Person, context: string): string {
  const firstName = person.name.split(" ")[0];
  return `Olá ${firstName}, encontrei-te na Percebera. Quero combinar a nossa troca de saberes: ${context}. Podemos falar por aqui?`;
}

export function whatsappInvite(handle: string, message: string): string {
  return `Nome de utilizador no WhatsApp: @${handle}\n\n${message}`;
}

export function whatsappShareLink(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
