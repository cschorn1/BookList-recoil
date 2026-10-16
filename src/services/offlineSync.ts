import { isBook, type Book } from "../types/Book";

export type PendingActionType = "criar" | "atualizar" | "remover";

export interface LivroPendente {
    id: string;
    action: PendingActionType;
    livro?: Book;
}

const STORAGE_KEY = "livrosPendentes";

function isLivroPendente(value: unknown): value is LivroPendente {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return false;
    }

    const pendencia = value as Record<string, unknown>;
    const action = pendencia.action;

    if (
        typeof pendencia.id !== "string" ||
        (action !== "criar" && action !== "atualizar" && action !== "remover")
    ) {
        return false;
    }

    if (action === "remover") {
        return pendencia.livro === undefined || isBook(pendencia.livro);
    }

    return isBook(pendencia.livro);
}

export function carregarPendencias(): LivroPendente[] {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const pendenciasSalvas = window.localStorage.getItem(STORAGE_KEY);
        if (!pendenciasSalvas) {
            return [];
        }

        const dados: unknown = JSON.parse(pendenciasSalvas);
        return Array.isArray(dados) ? dados.filter(isLivroPendente) : [];
    }catch {
        return [];
    }
}
export function salvarPendencias(pendencias: LivroPendente[]) {
    if (typeof window === "undefined") {
        return;
    }

    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pendencias));
    }catch {

    }
}

export function adicionarPendencia(pendencia: LivroPendente) {
    const pendenciasAtuais = carregarPendencias();

    const filtradas = pendenciasAtuais.filter((item) => !(item.id === pendencia.id && item.action === pendencia.action));

    salvarPendencias([...filtradas, pendencia]);
}

export function removerPendencia(id: string, action?: PendingActionType) {
    const pendenciasAtuais = carregarPendencias();

    const filtradas = action ? pendenciasAtuais.filter((item) => !(item.id === id && item.action === action))
        : pendenciasAtuais.filter((item) => item.id !== id);

    salvarPendencias(filtradas);
}

export function limparPendencias() {
    salvarPendencias([]);
}