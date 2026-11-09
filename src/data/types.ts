export type Verification = "identidade" | "comunidade" | "mentor";

export type CategoryId =
  | "oficios"
  | "linguas"
  | "tecnologia"
  | "culinaria"
  | "agricultura"
  | "musica"
  | "negocios"
  | "educacao"
  | "beleza";

export type OfferFormat = "Presencial" | "Online" | "Híbrido";
export type ExchangeStatus = "pendente" | "aceite" | "concluida" | "recusada" | "cancelada";
export type AvatarTone = "teal" | "ochre" | "coral" | "plum" | "sky" | "olive";

export interface Person {
  id: string;
  name: string;
  initials: string;
  city: string;
  province: string;
  languages: string[];
  verification: Verification;
  rating: number;
  reviewCount: number;
  exchanges: number;
  since: string;
  responseRate: number;
  headline: string;
  bio: string;
  tone: AvatarTone;
  whatsappUsername?: string;
}

export interface Offer {
  id: string;
  personId: string;
  title: string;
  category: CategoryId;
  description: string;
  outcomes: string[];
  wants: string[];
  format: OfferFormat;
  duration: string;
  availability: string;
  languages: string[];
  popularity: number;
  active: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  personId: string;
  offerTitle: string;
  authorName: string;
  authorId: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
}

export interface Exchange {
  id: string;
  offerId: string;
  fromPersonId: string;
  toPersonId: string;
  offeredSkill: string | null;
  offeredOfferId: string | null;
  message: string;
  format: OfferFormat;
  timing: string;
  status: ExchangeStatus;
  createdAt: string;
  completedAt: string | null;
  reviewedBy: string[];
}

export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  linkedin: string;
  interest: string;
  source: string;
  consent: boolean;
  createdAt: string;
  delivered: boolean;
}

export interface AppState {
  version: number;
  accountId: string | null;
  people: Person[];
  offers: Offer[];
  reviews: Review[];
  exchanges: Exchange[];
  saved: Record<string, string[]>;
  waitlist: WaitlistEntry[];
}

export const CATEGORIES: { id: CategoryId; label: string; short: string }[] = [
  { id: "oficios", label: "Ofícios e construção", short: "Ofícios" },
  { id: "linguas", label: "Línguas", short: "Línguas" },
  { id: "tecnologia", label: "Tecnologia e digital", short: "Tecnologia" },
  { id: "culinaria", label: "Culinária", short: "Culinária" },
  { id: "agricultura", label: "Agricultura e ambiente", short: "Agricultura" },
  { id: "musica", label: "Música e artes", short: "Música" },
  { id: "negocios", label: "Negócios e finanças", short: "Negócios" },
  { id: "educacao", label: "Educação e tutoria", short: "Educação" },
  { id: "beleza", label: "Beleza e cuidado", short: "Beleza" },
];

export const PROVINCES = [
  "Maputo Cidade",
  "Maputo Província",
  "Gaza",
  "Inhambane",
  "Sofala",
  "Manica",
  "Tete",
  "Zambézia",
  "Nampula",
  "Niassa",
  "Cabo Delgado",
];

export const VERIFICATION_LABELS: Record<Verification, string> = {
  identidade: "Identidade verificada",
  comunidade: "Membro de confiança",
  mentor: "Mentor verificado",
};

export const VERIFICATION_DESCRIPTIONS: Record<Verification, string> = {
  identidade: "Documento de identidade confirmado pela equipa.",
  comunidade: "Três trocas concluídas e uma referência da comunidade.",
  mentor: "Experiência ou credencial profissional confirmada.",
};

export const INTERESTS = [
  "Quero receber o convite de lançamento",
  "Quero aprender um ofício",
  "Quero ensinar o que sei",
  "Quero participar como organização",
  "Quero apoiar o piloto",
];
