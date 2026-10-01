import { useState } from "react";
import type { Todo } from "../types/Todo";

interface TodoItemProps {
    tarefa: Todo;
    excluirTarefa: (id: string) => void;
    concluirTarefa: (id: string) => void;
}

function TodoItem({ tarefa, excluirTarefa, concluirTarefa }: TodoItemProps) {
    const [expandido, setExpandido] = useState(false);

    return (
        <article className="flex gap-4 rounded-xl bg-white/70 p-4 shadow-md backdrop-blur-sm transition duration-300 hover:shadow-lg">
            {/* Imagem */}
            <div className="shrink-0">
                <img 
                    className="h-24 w-24 rounded-lg object-cover" 
                    src={tarefa.imagem} 
                    alt={tarefa.nome}    
                />
            </div>

            {/* Conteúdo */}
            <div className="flex flex-1 flex-col justify-between">
                <div className="flex-1">
                    <h2 className={`text-lg font-bold ${
                        tarefa.concluida ? "text-slate-400 line-through" : "text-slate-800"
                    }`}>
                        {tarefa.nome}
                    </h2>

                    {/* Descrição Retrátil */}
                    <div className="mt-2">
                        {tarefa.descricao ? (
                            <>
                                <button
                                    onClick={() => setExpandido(!expandido)}
                                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition"
                                >
                                    <span>{expandido ? "▼" : "▶"}</span>
                                    <span>Descrição</span>
                                </button>
                                {expandido && (
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600 pl-6 border-l-2 border-slate-300">
                                        {tarefa.descricao}
                                    </p>
                                )}
                            </>
                        ) : (
                            <p className="text-sm text-slate-400 flex items-center gap-2">
                                <span>🚫</span>
                                <span>Sem descrição</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Botões */}
                <div className="flex gap-3 mt-3">
                    <button 
                        onClick={() => concluirTarefa(tarefa._id!)}
                        className={`flex-1 rounded-lg px-3 py-2 font-medium text-white transition ${
                            tarefa.concluida 
                                ? "bg-blue-500 hover:bg-blue-600" 
                                : "bg-green-500 hover:bg-green-600"
                        }`}
                    >
                        {tarefa.concluida ? "Desmarcar" : "Concluir"}
                    </button>

                    <button 
                        onClick={() => excluirTarefa(tarefa._id!)}
                        className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600"
                    >
                        🗑️
                    </button>
                </div>
            </div>
        </article>
    );
}

export default TodoItem;