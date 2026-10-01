import { atom } from "recoil";

export type SyncStatus = "sincronizando" | "sincronizado" | "offline";

export const syncStatusAtom = atom<SyncStatus>({
    key: "syncStatusAtom",
    default: "sincronizando",
});