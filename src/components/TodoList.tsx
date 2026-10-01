import type { Todo } from "../types/Todo";
import TodoItem from "./TodoItem";

interface TodoListProps {
    tarefas: Todo[];
    excluirTarefa: (id: string) => void;
    concluirTarefa: (id: string) => void;
}

function TodoList({
    tarefas,
    excluirTarefa,
    concluirTarefa
}: TodoListProps) {
    return(
        <section className="mx-auto w-full max-w-6xl px-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tarefas.map((tarefa) => (
                <TodoItem key={tarefa._id} tarefa={tarefa}
                    excluirTarefa={excluirTarefa} concluirTarefa={concluirTarefa}
                />
            ))}
        </section>
    );
}

export default TodoList;