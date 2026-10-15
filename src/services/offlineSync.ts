import type { Book } from "../types/Book";

export type PendingActionType = "criar" | "atualizar" | "remover";

export interface LivroPendente {
    id: string;
    action: PendingActionType;
    livro?: Book;
}

const STORAGE_KEY = "livrosPendentes";

export function carregarPendencias(): LivroPendente[] {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const pendenciasSalvas = window.localStorage.getItem(STORAGE_KEY);
        return pendenciasSalvas ? (JSON.parse(pendenciasSalvas) as LivroPendente[]) : [];
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