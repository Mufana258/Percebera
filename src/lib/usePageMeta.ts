import { useEffect } from "react";

export function usePageMeta(_title: string, description?: string) {
  useEffect(() => {
    document.title = "Percebera";
    if (!description) return;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description);
  }, [_title, description]);
}
