import { useRecoilState, useSetRecoilState } from "recoil";
import { tarefasAtom } from "../atoms/tarefasAtom";
import { syncStatusAtom } from "../atoms/syncStatusAtom";
import { atualizarTarefa } from "../services/api";
import { adicionarPendencia, removerPendencia } from "../services/offlineSync";

export function useToggleTodo() {
    const [tarefas, setTarefas] = useRecoilState(tarefasAtom);
    const setSyncStatus = useSetRecoilState(syncStatusAtom);

    const concluirTarefa = async (id: string) => {
        const tarefaAtual = tarefas.find((tarefa) => tarefa._id === id);

        if (!tarefaAtual) {
            return;
        }

        const tarefaAtualizada = {
            ...tarefaAtual,
            concluida: !tarefaAtual.concluida,
        };

        setTarefas((tarefasAtuais) => tarefasAtuais.map((tarefa) => tarefa._id === id ? tarefaAtualizada : tarefa));

        if (id.startsWith("temp-")) {
            adicionarPendencia({ id, action: "criar", tarefa: tarefaAtualizada });
            return;
        }

        adicionarPendencia({ id, action: "atualizar", tarefa: tarefaAtualizada});

        const {_id: _, ...payload } = tarefaAtualizada;

        try {
            await atualizarTarefa(id, payload);
            removerPendencia(id, "atualizar");
        }catch (erro) {
            console.error("Atualizar falhou:", erro);
            setSyncStatus("offline");
        }
    };

    return concluirTarefa;
}