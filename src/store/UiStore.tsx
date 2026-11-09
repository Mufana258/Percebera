import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { CheckCircleIcon, AlertIcon, InfoIcon, CloseIcon } from "../components/Icons";
import { SignInDialog } from "../components/SignInDialog";

type ToastTone = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

interface UiContextValue {
  openSignIn: () => void;
  closeSignIn: () => void;
  toast: (message: string, tone?: ToastTone) => void;
}

const UiContext = createContext<UiContextValue | null>(null);

export function UiProvider({ children }: { children: ReactNode }) {
  const [signInOpen, setSignInOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);
  const timers = useRef<number[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, tone: ToastTone = "success") => {
      counter.current += 1;
      const id = counter.current;
      setToasts((prev) => [...prev.slice(-2), { id, message, tone }]);
      const timer = window.setTimeout(() => dismiss(id), 4500);
      timers.current.push(timer);
    },
    [dismiss],
  );

  useEffect(
    () => () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
    },
    [],
  );

  const openSignIn = useCallback(() => setSignInOpen(true), []);
  const closeSignIn = useCallback(() => setSignInOpen(false), []);

  return (
    <UiContext.Provider value={{ openSignIn, closeSignIn, toast }}>
      {children}
      <SignInDialog
        open={signInOpen}
        onClose={closeSignIn}
        onSignedIn={(name) => {
          setSignInOpen(false);
          toast(`Sessão iniciada como ${name}.`);
        }}
      />
      <div className="toast-stack" aria-live="polite">
        {toasts.map((item) => (
          <div key={item.id} className={`toast toast--${item.tone}`} role="status">
            <span className="toast__icon">
              {item.tone === "success" ? (
                <CheckCircleIcon size={18} />
              ) : item.tone === "error" ? (
                <AlertIcon size={18} />
              ) : (
                <InfoIcon size={18} />
              )}
            </span>
            <span>{item.message}</span>
            <button
              type="button"
              className="toast__close"
              onClick={() => dismiss(item.id)}
              aria-label="Fechar aviso"
            >
              <CloseIcon size={14} />
            </button>
          </div>
        ))}
      </div>
    </UiContext.Provider>
  );
}

export function useUi(): UiContextValue {
  const context = useContext(UiContext);
  if (!context) throw new Error("useUi deve ser usado dentro de UiProvider");
  return context;
}
