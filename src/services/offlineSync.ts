import type { Todo } from "../types/Todo";

export type PendingActionType = "criar" | "atualizar" | "remover";

export interface TarefaPendente {
    id: string;
    action: PendingActionType;
    tarefa?: Todo;
}

const STORAGE_KEY = "tarefasPendentes";

export function carregarPendencias(): TarefaPendente[] {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const pendenciasSalvas = window.localStorage.getItem(STORAGE_KEY);
        return pendenciasSalvas ? (JSON.parse(pendenciasSalvas) as TarefaPendente[]) : [];
    }catch {
        return [];
    }
}
export function salvarPendencias(pendencias: TarefaPendente[]) {
    if (typeof window === "undefined") {
        return;
    }

    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pendencias));
    }catch {

    }
}

export function adicionarPendencia(pendencia: TarefaPendente) {
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