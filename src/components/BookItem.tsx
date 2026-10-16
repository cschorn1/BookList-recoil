import { useState } from "react";
import type { Book } from "../types/Book";

interface BookItemProps {
    livro: Book;
    excluirLivro: (id: string) => void;
    concluirLivro: (id: string) => void;
}

function BookItem({ livro, excluirLivro, concluirLivro }: BookItemProps) {
    const [expandido, setExpandido] = useState(false);

    return (
        <article className="@container relative rounded-xl bg-white/70 p-4 shadow-md backdrop-blur-sm transition duration-300 hover:shadow-lg">
            <div className="grid grid-cols-1 gap-x-4 gap-y-3 @xs:grid-cols-[112px_minmax(0,1fr)]">
                {/* Imagem */}
                <div className="flex justify-center @xs:row-span-2 @xs:justify-start @md:row-span-3">
                    <img
                        className="aspect-2/3 w-36 rounded-lg object-cover @xs:w-24 @md:w-28"
                        src={livro.image}
                        alt={livro.title}
                    />
                </div>

                {/* Título e autor */}
                <div className="@xs:col-start-2 @xs:pr-8">
                    <h2 className={`text-xl font-bold ${
                        livro.status === 'Lido' ? "text-slate-400 line-through" : "text-slate-800"
                    }`}>
                        {livro.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">{livro.author}</p>
                    <p className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-600">
                        {livro.genre}
                    </p>
                </div>

                {/* Descrição Retrátil */}
                <div className="@xs:col-span-2 @md:col-span-1 @md:col-start-2">
                    {livro.description ? (
                        <>
                            <button
                                type="button"
                                onClick={() => setExpandido(!expandido)}
                                className="flex items-center gap-2 text-sm text-blue-600 transition hover:text-blue-800"
                            >
                                <span>{expandido ? "▼" : "▶"}</span>
                                <span>Descrição</span>
                            </button>
                            {expandido && (
                                <p className="mt-2 border-l-2 border-slate-300 pl-6 text-sm leading-relaxed text-slate-600">
                                    {livro.description}
                                </p>
                            )}
                        </>
                    ) : (
                        <p className="flex items-center gap-2 text-sm text-slate-400">
                            <span>🚫</span>
                            <span>Sem descrição</span>
                        </p>
                    )}
                </div>

                {/* Ações */}
                <div className="flex justify-end @xs:col-span-2 @md:col-span-1 @md:col-start-2">
                    <button
                        type="button"
                        onClick={() => concluirLivro(livro._id)}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                            livro.status === "Lido"
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                        }`}
                    >
                        {livro.status === 'Não lido' ? "Marcar lido" : "Marcar não lido"}
                    </button>
                </div>
            </div>

            {!livro.isMock && (
                <button
                    type="button"
                    aria-label={`Excluir ${livro.title}`}
                    onClick={() => excluirLivro(livro._id)}
                    className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/90 text-lg text-red-600 shadow-sm transition hover:bg-red-600 hover:text-white"
                >
                    ×
                </button>
            )}
        </article>
    );
}

export default BookItem;