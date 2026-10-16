import { isBook, type Book, type NewBook } from "../types/Book";
import API_URL from "./api";

const BOOKS_URL = `${API_URL}/books`;
const criacoesEmAndamento = new Map<string, Promise<Book>>();

export const buscarLivros = async (): Promise<Book[]> => {
    const resposta = await fetch(BOOKS_URL);

    if (!resposta.ok) {
        throw new Error("Erro ao carregar livros");
    }

    const dados: unknown = await resposta.json();
    if (!Array.isArray(dados) || !dados.every(isBook)) {
        throw new Error("A API retornou uma lista de livros inválida");
    }

    return dados;
};

export const addLivro = async (livro: NewBook, operationId?: string): Promise<Book> => {
    if (operationId) {
        const criacaoExistente = criacoesEmAndamento.get(operationId);
        if (criacaoExistente) {
            return criacaoExistente;
        }
    }

    const requisicao = (async () => {
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

        const livroCriado: unknown = await resposta.json();
        if (!isBook(livroCriado)) {
            throw new Error("A API retornou um livro inválido");
        }

        return livroCriado;
    })();

    if (operationId) {
        criacoesEmAndamento.set(operationId, requisicao);
    }

    try {
        return await requisicao;
    } finally {
        if (operationId && criacoesEmAndamento.get(operationId) === requisicao) {
            criacoesEmAndamento.delete(operationId);
        }
    }
};

export const atualizarLivro = async (
    id: string,
    livro: NewBook
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