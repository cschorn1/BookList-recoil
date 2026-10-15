import { atom } from "recoil";
import type { BookStatus } from "../types/Book";

export type GenreFilter = "todos" | "romance" | "infantil" | "terror" | "autoajuda" | "outro";
export type StatusFilter = "todos" | BookStatus;

export interface BookFilters {
  genre: GenreFilter;
  status: StatusFilter;
}

export const filtroAtom = atom<BookFilters>({
  key: "filtroAtom",
  default: { genre: "todos", status: "todos" },
});
