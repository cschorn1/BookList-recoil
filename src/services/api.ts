import type { Todo } from "../types/Todo";

const API_URL = "https://crudcrud.com/api/c36750314fbf47d88969d0b8b04f07ad";

export const buscarTarefas = async (): Promise<Todo[]> => {
    const resposta = await fetch(`${API_URL}/tarefas`);

    if (!resposta.ok) {
        throw new Error("Erro ao carregar tarefas");
    }

    return await resposta.json();
};

export const criarTarefa = async (tarefa: Todo): Promise<Todo> => {
    const resposta = await fetch(`${API_URL}/tarefas`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tarefa)
    });

    if (!resposta.ok) {
        throw new Error("Erro ao cadastrar tarefa");
    }

    return await resposta.json();
};

export const atualizarTarefa = async (id: string, tarefa: Todo): Promise<Todo> => {
    const { _id, ...tarefaSemId } = tarefa;

    const resposta = await fetch(`${API_URL}/tarefas/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tarefaSemId)
    });

    if (!resposta.ok) {
        throw new Error("Erro ao atualizar tarefa");
    }

    return tarefa;
};

export const removerTarefa = async (id: string): Promise<void> => {
    const resposta = await fetch(`${API_URL}/tarefas/${id}`, {
        method: "DELETE"
    });

    if (!resposta.ok) {
        throw new Error("Erro ao excluir tarefa");
    }
};

export default API_URL;