import type { Book } from "../types/Book";
import BookItem from "./BookItem";

interface BookListProps {
    livros: Book[];
    excluirLivro: (id: string) => void;
    concluirLivro: (id: string) => void;
}

function BookList({
    livros,
    excluirLivro,
    concluirLivro
}: BookListProps) {
    return(
        <section className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-4">
            {livros.map((livro) => (
                <BookItem key={livro._id} livro={livro}
                    excluirLivro={excluirLivro} concluirLivro={concluirLivro}
                />
            ))}
        </section>
    );
}

export default BookList;