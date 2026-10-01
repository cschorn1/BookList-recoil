import { useRecoilState, useSetRecoilState } from "recoil";
import { tarefasAtom } from "../atoms/tarefasAtom";
import { syncStatusAtom } from "../atoms/syncStatusAtom";
import { removerTarefa } from "../services/api";
import { adicionarPendencia, removerPendencia } from "../services/offlineSync";

export function useDeleteTodo() {
    const [tarefas, setTarefas] = useRecoilState(tarefasAtom);
    const setSyncStatus = useSetRecoilState(syncStatusAtom);

    const excluirTarefa = async (id: string) => {
        const tarefa = tarefas.find((item) => item._id === id);
        if (!tarefa) {
            return;
        }

        if (id.startsWith("temp-")) {
            setTarefas((tarefasAtuais) => tarefasAtuais.filter((item) => item._id !== id));           
            removerPendencia(id, "criar");
            return;
        }

        setTarefas((tarefasAtuais) => tarefasAtuais.filter((item) => item._id !== id));
        adicionarPendencia({ id, action: "remover",});
        
        try{
            await removerTarefa(id);
            removerPendencia(id, "remover");
        }catch (erro) {
            console.error("Remover falhou:", erro);
            setSyncStatus("offline"); 
        }
    };

    return excluirTarefa;
}