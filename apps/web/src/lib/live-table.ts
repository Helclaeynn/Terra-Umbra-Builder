// État partagé de la table en jeu : la page (CampaignPlayPage.vue) le fournit,
// ses morceaux (colonne des participants, journal, panneau du MJ) le lisent.
import { inject, provide, type InjectionKey } from "vue";

// shortcut: état non typé finement (la page manipule des objets serveur en `any`), à typer avec le modèle de la table.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LiveTable = Record<string, any>;
const key: InjectionKey<LiveTable> = Symbol("live-table");

export function provideLiveTable(table: LiveTable) {
  provide(key, table);
}

export function useLiveTable(): LiveTable {
  const table = inject(key);
  if (!table) throw new Error("useLiveTable() hors de la table en jeu");
  return table;
}
