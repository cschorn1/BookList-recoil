import { atom } from "recoil";
import type { Book } from "../types/Book";
import { listaMock } from "../data/listaMock";

const livrosMockLocais = listaMock.map((livro, index) => ({
    ...livro,
    _id: `mock-${index + 1}`,
}));

function carregarLivrosSalvos(): Book[] {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const livrosSalvos = window.localStorage.getItem("livros");
        const livros = livrosSalvos ? (JSON.parse(livrosSalvos) as Book[]) : [];
        return livros.length > 0 ? livros : livrosMockLocais;
    }catch {
        return livrosMockLocais;
    }
}

export const livrosAtom = atom<Book[]>({
  key: "livrosAtom",
  default: carregarLivrosSalvos(),
});
