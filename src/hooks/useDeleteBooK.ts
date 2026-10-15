import { useRecoilState, useSetRecoilState } from "recoil";
import { livrosAtom } from "../atoms/booksAtom";
import { syncStatusAtom } from "../atoms/syncStatusAtom";
import { adicionarPendencia, removerPendencia } from "../services/offlineSync";
import { removerLivro } from "../services/bookApi";

export function useDeleteBook() {
    const [livros, setLivros] = useRecoilState(livrosAtom);
    const setSyncStatus = useSetRecoilState(syncStatusAtom);

    const excluirLivro = async (id: string) => {
        const livro = livros.find((item) => item._id === id);
        if (!livro) {
            return;
        }

        if (id.startsWith("temp-")) {
            setLivros((livrosAtuais) => livrosAtuais.filter((item) => item._id !== id));           
            removerPendencia(id, "criar");
            return;
        }

        setLivros((livrosAtuais) => livrosAtuais.filter((item) => item._id !== id));
        adicionarPendencia({ id, action: "remover",});
        
        try{
            await removerLivro(id);
            removerPendencia(id, "remover");
        }catch (erro) {
            console.error("Remover falhou:", erro);
            setSyncStatus("offline"); 
        }
    };

    return excluirLivro;
}