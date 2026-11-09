import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AppState,
  Exchange,
  Offer,
  OfferFormat,
  Person,
  Review,
  WaitlistEntry,
} from "../data/types";
import { initialState } from "../data/seed";

const STORAGE_KEY = "percebera.state.v2";

type NewOffer = Omit<Offer, "id" | "personId" | "popularity" | "active" | "createdAt">;

export interface ProposeInput {
  offerId: string;
  message: string;
  offeredOfferId: string | null;
  format: OfferFormat;
  timing: string;
}

export interface ActionResult {
  ok: boolean;
  error?: string;
  id?: string;
}

interface AppContextValue {
  state: AppState;
  me: Person | null;
  myOffers: Offer[];
  myExchanges: Exchange[];
  incoming: Exchange[];
  outgoing: Exchange[];
  savedIds: string[];
  signIn: (personId: string) => void;
  signOut: () => void;
  personById: (id: string) => Person | undefined;
  offerById: (id: string) => Offer | undefined;
  offersByPerson: (personId: string) => Offer[];
  reviewsByPerson: (personId: string) => Review[];
  isSaved: (offerId: string) => boolean;
  toggleSave: (offerId: string) => void;
  propose: (input: ProposeInput) => ActionResult;
  acceptExchange: (id: string) => ActionResult;
  declineExchange: (id: string) => ActionResult;
  cancelExchange: (id: string) => ActionResult;
  completeExchange: (id: string) => ActionResult;
  addReview: (exchangeId: string, rating: number, text: string) => ActionResult;
  addOffer: (offer: NewOffer) => ActionResult;
  toggleOfferActive: (offerId: string) => void;
  recordWaitlist: (entry: Omit<WaitlistEntry, "id" | "createdAt" | "delivered">) => {
    duplicate: boolean;
    entry: WaitlistEntry;
  };
  markWaitlistDelivered: (id: string) => void;
  resetDemo: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(initialState);
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed || parsed.version !== initialState.version || !Array.isArray(parsed.offers)) {
      return structuredClone(initialState);
    }
    return { ...structuredClone(initialState), ...parsed };
  } catch {
    return structuredClone(initialState);
  }
}

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage can be unavailable in private browsing. The demo keeps working in memory.
    }
  }, [state]);

  const me = useMemo(
    () => state.people.find((person) => person.id === state.accountId) ?? null,
    [state.people, state.accountId],
  );

  const personById = useCallback(
    (id: string) => state.people.find((person) => person.id === id),
    [state.people],
  );

  const offerById = useCallback(
    (id: string) => state.offers.find((offer) => offer.id === id),
    [state.offers],
  );

  const offersByPerson = useCallback(
    (personId: string) => state.offers.filter((offer) => offer.personId === personId),
    [state.offers],
  );

  const reviewsByPerson = useCallback(
    (personId: string) =>
      state.reviews
        .filter((review) => review.personId === personId)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [state.reviews],
  );

  const myOffers = useMemo(
    () => (me ? state.offers.filter((offer) => offer.personId === me.id) : []),
    [state.offers, me],
  );

  const myExchanges = useMemo(() => {
    if (!me) return [];
    return state.exchanges
      .filter((ex) => ex.fromPersonId === me.id || ex.toPersonId === me.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [state.exchanges, me]);

  const incoming = useMemo(
    () => (me ? myExchanges.filter((ex) => ex.toPersonId === me.id && ex.status === "pendente") : []),
    [myExchanges, me],
  );

  const outgoing = useMemo(
    () => (me ? myExchanges.filter((ex) => ex.fromPersonId === me.id) : []),
    [myExchanges, me],
  );

  const savedIds = useMemo(
    () => (me ? state.saved[me.id] ?? [] : []),
    [state.saved, me],
  );

  const signIn = useCallback((personId: string) => {
    setState((prev) => ({ ...prev, accountId: personId }));
  }, []);

  const signOut = useCallback(() => {
    setState((prev) => ({ ...prev, accountId: null }));
  }, []);

  const toggleSave = useCallback(
    (offerId: string) => {
      setState((prev) => {
        if (!prev.accountId) return prev;
        const current = prev.saved[prev.accountId] ?? [];
        const next = current.includes(offerId)
          ? current.filter((id) => id !== offerId)
          : [...current, offerId];
        return { ...prev, saved: { ...prev.saved, [prev.accountId]: next } };
      });
    },
    [],
  );

  const isSaved = useCallback(
    (offerId: string) => savedIds.includes(offerId),
    [savedIds],
  );

  const propose = useCallback(
    (input: ProposeInput): ActionResult => {
      if (!me) return { ok: false, error: "Precisa de iniciar sessão para propor uma troca." };
      const offer = state.offers.find((item) => item.id === input.offerId);
      if (!offer) return { ok: false, error: "Esta oferta já não está disponível." };
      if (offer.personId === me.id) return { ok: false, error: "Esta oferta é sua." };
      if (!offer.active) return { ok: false, error: "Esta oferta está pausada." };
      if (!input.message.trim()) return { ok: false, error: "Escreva uma mensagem para a outra pessoa." };
      if (!input.offeredOfferId) return { ok: false, error: "Escolha um saber seu para oferecer em troca." };
      const myOffer = state.offers.find((item) => item.id === input.offeredOfferId);
      if (!myOffer || myOffer.personId !== me.id) {
        return { ok: false, error: "A oferta escolhida não lhe pertence." };
      }

      const id = makeId("ex");
      const now = new Date().toISOString();

      setState((prev) => ({
        ...prev,
        exchanges: [
          {
            id,
            offerId: offer.id,
            fromPersonId: me.id,
            toPersonId: offer.personId,
            offeredSkill: myOffer.title,
            offeredOfferId: myOffer.id,
            message: input.message.trim(),
            format: input.format,
            timing: input.timing.trim(),
            status: "pendente",
            createdAt: now,
            completedAt: null,
            reviewedBy: [],
          },
          ...prev.exchanges,
        ],
      }));

      return { ok: true, id };
    },
    [me, state.offers],
  );

  const acceptExchange = useCallback(
    (id: string): ActionResult => {
      if (!me) return { ok: false, error: "Inicie sessão primeiro." };
      const exchange = state.exchanges.find((item) => item.id === id);
      if (!exchange) return { ok: false, error: "Troca não encontrada." };
      if (exchange.toPersonId !== me.id) return { ok: false, error: "Só quem recebe o pedido pode aceitar." };
      if (exchange.status !== "pendente") return { ok: false, error: "Este pedido já foi respondido." };
      setState((prev) => ({
        ...prev,
        exchanges: prev.exchanges.map((item) =>
          item.id === id ? { ...item, status: "aceite" } : item,
        ),
      }));
      return { ok: true };
    },
    [me, state.exchanges],
  );

  const declineExchange = useCallback(
    (id: string): ActionResult => {
      if (!me) return { ok: false, error: "Inicie sessão primeiro." };
      const exchange = state.exchanges.find((item) => item.id === id);
      if (!exchange) return { ok: false, error: "Troca não encontrada." };
      if (exchange.toPersonId !== me.id) return { ok: false, error: "Só quem recebe o pedido pode recusar." };
      if (exchange.status !== "pendente") return { ok: false, error: "Este pedido já foi respondido." };
      setState((prev) => ({
        ...prev,
        exchanges: prev.exchanges.map((item) =>
          item.id === id ? { ...item, status: "recusada" } : item,
        ),
      }));
      return { ok: true };
    },
    [me, state.exchanges],
  );

  const cancelExchange = useCallback(
    (id: string): ActionResult => {
      if (!me) return { ok: false, error: "Inicie sessão primeiro." };
      const exchange = state.exchanges.find((item) => item.id === id);
      if (!exchange) return { ok: false, error: "Troca não encontrada." };
      if (exchange.fromPersonId !== me.id) return { ok: false, error: "Só quem propôs pode cancelar." };
      if (exchange.status !== "pendente") return { ok: false, error: "Este pedido já não pode ser cancelado." };
      setState((prev) => ({
        ...prev,
        exchanges: prev.exchanges.map((item) =>
          item.id === id ? { ...item, status: "cancelada" } : item,
        ),
      }));
      return { ok: true };
    },
    [me, state.exchanges],
  );

  const completeExchange = useCallback(
    (id: string): ActionResult => {
      if (!me) return { ok: false, error: "Inicie sessão primeiro." };
      const exchange = state.exchanges.find((item) => item.id === id);
      if (!exchange) return { ok: false, error: "Troca não encontrada." };
      if (exchange.fromPersonId !== me.id && exchange.toPersonId !== me.id) {
        return { ok: false, error: "Não participa nesta troca." };
      }
      if (exchange.status !== "aceite") return { ok: false, error: "Só trocas aceites podem ser concluídas." };
      const now = new Date().toISOString();
      setState((prev) => ({
        ...prev,
        exchanges: prev.exchanges.map((item) =>
          item.id === id ? { ...item, status: "concluida", completedAt: now } : item,
        ),
      }));
      return { ok: true };
    },
    [me, state.exchanges],
  );

  const addReview = useCallback(
    (exchangeId: string, rating: number, text: string): ActionResult => {
      if (!me) return { ok: false, error: "Inicie sessão primeiro." };
      const exchange = state.exchanges.find((item) => item.id === exchangeId);
      if (!exchange) return { ok: false, error: "Troca não encontrada." };
      if (exchange.fromPersonId !== me.id && exchange.toPersonId !== me.id) {
        return { ok: false, error: "Não participa nesta troca." };
      }
      if (exchange.status !== "concluida") return { ok: false, error: "Só pode avaliar trocas concluídas." };
      if (exchange.reviewedBy.includes(me.id)) return { ok: false, error: "Já avaliou esta troca." };
      if (!text.trim()) return { ok: false, error: "Escreva uma nota curta sobre a troca." };
      const offer = state.offers.find((item) => item.id === exchange.offerId);
      const otherId = exchange.fromPersonId === me.id ? exchange.toPersonId : exchange.fromPersonId;
      const review: Review = {
        id: makeId("r"),
        personId: otherId,
        offerTitle: offer?.title ?? "Troca de saberes",
        authorName: me.name,
        authorId: me.id,
        rating,
        text: text.trim(),
        date: new Date().toISOString().slice(0, 10),
        verified: true,
      };
      setState((prev) => ({
        ...prev,
        reviews: [review, ...prev.reviews],
        exchanges: prev.exchanges.map((item) =>
          item.id === exchangeId
            ? { ...item, reviewedBy: [...item.reviewedBy, me.id] }
            : item,
        ),
      }));
      return { ok: true, id: review.id };
    },
    [me, state.exchanges, state.offers],
  );

  const addOffer = useCallback(
    (offer: NewOffer): ActionResult => {
      if (!me) return { ok: false, error: "Inicie sessão para publicar." };
      const id = makeId("o");
      setState((prev) => ({
        ...prev,
        offers: [
          {
            ...offer,
            id,
            personId: me.id,
            popularity: 0,
            active: true,
            createdAt: new Date().toISOString(),
          },
          ...prev.offers,
        ],
      }));
      return { ok: true, id };
    },
    [me],
  );

  const toggleOfferActive = useCallback(
    (offerId: string) => {
      setState((prev) => ({
        ...prev,
        offers: prev.offers.map((offer) =>
          offer.id === offerId && offer.personId === prev.accountId
            ? { ...offer, active: !offer.active }
            : offer,
        ),
      }));
    },
    [],
  );

  const recordWaitlist = useCallback(
    (entry: Omit<WaitlistEntry, "id" | "createdAt" | "delivered">) => {
      const email = entry.email.trim().toLowerCase();
      const existing = state.waitlist.find(
        (item) => item.email.trim().toLowerCase() === email,
      );
      if (existing) {
        return { duplicate: true, entry: existing };
      }
      const record: WaitlistEntry = {
        ...entry,
        email,
        id: makeId("wl"),
        createdAt: new Date().toISOString(),
        delivered: false,
      };
      setState((prev) => ({ ...prev, waitlist: [record, ...prev.waitlist] }));
      return { duplicate: false, entry: record };
    },
    [state.waitlist],
  );

  const markWaitlistDelivered = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      waitlist: prev.waitlist.map((entry) =>
        entry.id === id ? { ...entry, delivered: true } : entry,
      ),
    }));
  }, []);

  const resetDemo = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage failures.
    }
    setState(structuredClone(initialState));
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      me,
      myOffers,
      myExchanges,
      incoming,
      outgoing,
      savedIds,
      signIn,
      signOut,
      personById,
      offerById,
      offersByPerson,
      reviewsByPerson,
      isSaved,
      toggleSave,
      propose,
      acceptExchange,
      declineExchange,
      cancelExchange,
      completeExchange,
      addReview,
      addOffer,
      toggleOfferActive,
      recordWaitlist,
      markWaitlistDelivered,
      resetDemo,
    }),
    [
      state,
      me,
      myOffers,
      myExchanges,
      incoming,
      outgoing,
      savedIds,
      signIn,
      signOut,
      personById,
      offerById,
      offersByPerson,
      reviewsByPerson,
      isSaved,
      toggleSave,
      propose,
      acceptExchange,
      declineExchange,
      cancelExchange,
      completeExchange,
      addReview,
      addOffer,
      toggleOfferActive,
      recordWaitlist,
      markWaitlistDelivered,
      resetDemo,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp deve ser usado dentro de AppProvider");
  return context;
}
