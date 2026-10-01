import { useState } from "react";
import { useAddTodo } from "../hooks/useAddTodo";

function TodoForm() {
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const adicionarTarefa = useAddTodo();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const novaTarefa = {
            nome,
            imagem: `https://placehold.co/300x200?text=${nome}`,
            descricao,
            concluida: false
        };

        adicionarTarefa(novaTarefa);

        setNome("");
        setDescricao("");
    };

    return (
        <form className="mx-auto w-full max-w-6xl px-4 flex flex-col lg:flex-row gap-4 rounded-2xl bg-white p-6 shadow-lg" onSubmit={handleSubmit}>
            <input id="tituloTarefa" className="flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" type="text" 
                placeholder="Nome da tarefa" value={nome}
                onChange={(e) => setNome(e.target.value)} required
            />

            <textarea id="descricaoTarefa" className="flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                placeholder="Descrição (opcional)" value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
            />

            <button className="rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600 lg:w-auto" type="submit">
                Adicionar
            </button>
        </form>
    );
}

export default TodoForm;