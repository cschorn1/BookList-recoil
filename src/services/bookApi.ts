import type { Book } from "../types/Book";
import API_URL from "./api";

const BOOKS_URL = `${API_URL}/books`;

export const buscarLivros = async (): Promise<Book[]> => {
    const resposta = await fetch(BOOKS_URL);

    if (!resposta.ok) {
        throw new Error("Erro ao carregar livros");
    }

    return resposta.json();
};

export const addLivro = async (livro: Omit<Book, "_id">): Promise<Book> => {
    const resposta = await fetch(BOOKS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(livro)
    });

    if (!resposta.ok) {
        throw new Error("Erro ao cadastrar livro");
    }

    return resposta.json();
};

export const atualizarLivro = async (
    id: string,
    livro: Omit<Book, "_id">
): Promise<void> => {
    const resposta = await fetch(`${BOOKS_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(livro)
    });

    if (!resposta.ok) {
        throw new Error("Erro ao atualizar livro");
    }
};

export const removerLivro = async (id: string): Promise<void> => {
    const resposta = await fetch(`${BOOKS_URL}/${id}`, {
        method: "DELETE"
    });

    if (!resposta.ok) {
        throw new Error("Erro ao remover livro");
    }
};