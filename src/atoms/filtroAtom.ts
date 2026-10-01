import { atom } from "recoil";

export type TodoFilter = "todas" | "concluidas" | "pendentes";

export const filtroAtom = atom<TodoFilter>({
  key: "filtroAtom",
  default: "todas",
});
