// Fenêtre de confirmation du site (lot Builder, 06/11), à la place de window.confirm :
// mêmes couleurs que le site, boutons qui disent ce qu'ils font.
// La fenêtre elle-même est ConfirmDialog.vue, montée une fois pour tout le site (main.ts).
import { shallowRef } from "vue";

export type ConfirmRequest = {
  message: string;
  title?: string;
  confirm?: string;
  cancel?: string;
  danger?: boolean;
  resolve: (ok: boolean) => void;
};

export const confirmRequest = shallowRef<ConfirmRequest | null>(null);
// Vrai quand ConfirmDialog est monté ; sinon (composant testé seul, navigateur
// sans <dialog>) on revient à la fenêtre du navigateur.
export const dialogHost = { mounted: false };

export function confirmDialog(message: string, options: Omit<ConfirmRequest, "message" | "resolve"> = {}): Promise<boolean> {
  if (!dialogHost.mounted) return Promise.resolve(window.confirm(message));
  confirmRequest.value?.resolve(false);
  return new Promise((resolve) => {
    confirmRequest.value = { message, ...options, resolve };
  });
}
