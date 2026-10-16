import { atom } from "recoil";
import { isBook, type Book } from "../types/Book";
import { listaMock } from "../data/listaMock";

const livrosMockLocais = listaMock.map((livro, index) => ({
    ...livro,
    _id: `mock-${index + 1}`,
}));

export function lerLivrosLocais(): Book[] {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const livrosSalvos = window.localStorage.getItem("livros");
        if (!livrosSalvos) {
            return [];
        }

        const dados: unknown = JSON.parse(livrosSalvos);
        return Array.isArray(dados) ? dados.filter(isBook) : [];
    }catch {
        return [];
    }
}

function carregarLivrosSalvos(): Book[] {
    const livros = lerLivrosLocais();
    return livros.length > 0 ? livros : livrosMockLocais;
}

export const livrosAtom = atom<Book[]>({
  key: "livrosAtom",
  default: carregarLivrosSalvos(),
});
