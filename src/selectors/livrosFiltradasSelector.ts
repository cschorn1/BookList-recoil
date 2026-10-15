import { selector } from "recoil";
import { livrosAtom } from "../atoms/booksAtom";
import { filtroAtom } from "../atoms/filtroAtom";

export const livrosFiltradosSelector = selector({
    key: "livrosFiltradosSelector",
    get: ({ get }) => {
        const livros = get(livrosAtom);
        const { genre, status } = get(filtroAtom);

        return livros.filter((livro) => {
            const generoCorresponde =
                genre === "todos" || livro.genre.toLowerCase() === genre;
            const statusCorresponde =
                status === "todos" || livro.status === status;

            return generoCorresponde && statusCorresponde;
        });
    },
});