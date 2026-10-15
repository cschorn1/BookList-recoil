import { useRecoilState, useSetRecoilState } from "recoil";
import { livrosAtom } from "../atoms/booksAtom";
import { syncStatusAtom } from "../atoms/syncStatusAtom";
import { atualizarLivro } from "../services/bookApi";
import { adicionarPendencia, removerPendencia } from "../services/offlineSync";

export function useToggleBook() {
    const [livros, setLivros] = useRecoilState(livrosAtom);
    const setSyncStatus = useSetRecoilState(syncStatusAtom);

    const concluirLivro = async (id: string) => {
        const livroAtual = livros.find((livro) => livro._id === id);

        if (!livroAtual) {
            return;
        }

        const livroAtualizado: typeof livroAtual = {
            ...livroAtual,
            status: livroAtual.status === "Lido" ? "Não lido" : "Lido",
        };

        setLivros((livrosAtuais) => livrosAtuais.map((livro) => livro._id === id ? livroAtualizado : livro));

        if (id.startsWith("mock-")) {
            return;
        }

        if (id.startsWith("temp-")) {
            adicionarPendencia({ id, action: "criar", livro: livroAtualizado });
            return;
        }

        adicionarPendencia({ id, action: "atualizar", livro: livroAtualizado});

        const {_id: _, ...payload } = livroAtualizado;

        try {
            await atualizarLivro(id, payload);
            removerPendencia(id, "atualizar");
        }catch (erro) {
            console.error("Atualizar falhou:", erro);
            setSyncStatus("offline");
        }
    };

    return concluirLivro;
}