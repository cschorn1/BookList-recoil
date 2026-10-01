import { atom } from "recoil";
import type { Todo } from "../types/Todo";

function carregarTarefasSalvas(): Todo[] {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const tarefasSalvas = window.localStorage.getItem("tarefas");
        return tarefasSalvas ? (JSON.parse(tarefasSalvas) as Todo[]) : [];
    }catch {
        return [];
    }
}

export const tarefasAtom = atom<Todo[]>({
  key: "tarefasAtom",
  default: carregarTarefasSalvas(),
});
