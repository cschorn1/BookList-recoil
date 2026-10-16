import { useSetRecoilState} from "recoil";
import type { Book, NewBook } from "../types/Book";
import { livrosAtom } from "../atoms/booksAtom";
import { syncStatusAtom } from "../atoms/syncStatusAtom";
import { addLivro as criarLivroNaApi } from "../services/bookApi";
import { adicionarPendencia, removerPendencia } from "../services/offlineSync";

export function useAddBook() {
    const setLivros = useSetRecoilState(livrosAtom);
    const setSyncStatus = useSetRecoilState(syncStatusAtom);

    const addLivro = async (livro: NewBook) => {
        const tempId = `temp-${crypto.randomUUID()}`;
        const temporario: Book = { ...livro, _id: tempId };
        setLivros((livrosAtuais) => [...livrosAtuais, temporario]);
        adicionarPendencia({ id: tempId, action: "criar", livro:temporario});

        try {
            const livroCriado = await criarLivroNaApi(livro, tempId);
            removerPendencia(tempId, "criar");
            setLivros((livrosAtuais) => livrosAtuais.map((item) => item._id === tempId ? { ...item, ...livroCriado} : item));
            
        }catch (erro) {
            console.error("Criar falhou:", erro);
            setSyncStatus("offline");
        }
    };

    return addLivro;
}