import type { OfferFormat } from "../data/types";

const MONTHS = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

export function formatDate(value: string): string {
  const date = new Date(value.length === 10 ? `${value}T12:00:00` : value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${formatDate(value)}, ${hours}h${minutes}`;
}

export function ratingLabel(rating: number): string {
  return rating.toFixed(1).replace(".", ",");
}

export function formatLabel(format: OfferFormat): string {
  if (format === "Online") return "Online";
  if (format === "Presencial") return "Presencial";
  return "Híbrido";
}

export function slugToTitle(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function plural(value: number, singular: string, pluralForm: string): string {
  return value === 1 ? singular : pluralForm;
}
