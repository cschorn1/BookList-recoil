import { useState } from "react";
import { useAddBook } from "../hooks/useAddBook";

function BookForm() {
    const [nome, setTitle] = useState("");
    const [descricao, setAuthor] = useState("");
    const [descricaoLivro, setDescricaoLivro] = useState("");
    const [genero, setGenero] = useState("outro");
    const addLivro = useAddBook();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newLivro = {
            title: nome,
            author: descricao,
            description: descricaoLivro.trim() || undefined,
            image: `https://placehold.co/300x200?text=${nome}`,
            genre: genero,
            status: "Não lido" as const
        };

        addLivro(newLivro);

        setTitle("");
        setAuthor("");
        setDescricaoLivro("");
        setGenero("outro");
    };

    return (
        <form className="mx-auto w-full max-w-6xl px-4 flex flex-col lg:flex-row gap-4 rounded-2xl bg-white p-6 shadow-lg" onSubmit={handleSubmit}>
            <input id="tituloTarefa" className="flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" type="text" 
                placeholder="Nome do Livro" value={nome}
                onChange={(e) => setTitle(e.target.value)} required
            />

            <textarea id="descricaoTarefa" className="flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                placeholder="Autor" value={descricao}
                onChange={(e) => setAuthor(e.target.value)} required
            />

            <textarea
                id="descricaoLivro"
                className="flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Descrição (opcional)"
                value={descricaoLivro}
                onChange={(event) => setDescricaoLivro(event.target.value)}
            />

            <select
                id="generoLivro"
                aria-label="Gênero do livro"
                className="flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={genero}
                onChange={(event) => setGenero(event.target.value)}
            >
                <option value="romance">Romance</option>
                <option value="infantil">Infantil</option>
                <option value="terror">Terror</option>
                <option value="autoajuda">Autoajuda</option>
                <option value="outro">Outro</option>
            </select>

            <button className="rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600 lg:w-auto" type="submit">
                Adicionar
            </button>
        </form>
    );
}

export default BookForm;