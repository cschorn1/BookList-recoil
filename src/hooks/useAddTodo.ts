import { useSetRecoilState} from "recoil";
import type { Todo } from "../types/Todo";
import { tarefasAtom } from "../atoms/tarefasAtom";
import { syncStatusAtom } from "../atoms/syncStatusAtom";
import { criarTarefa } from "../services/api";
import { adicionarPendencia, removerPendencia } from "../services/offlineSync";

export function useAddTodo() {
    const setTarefas = useSetRecoilState(tarefasAtom);
    const setSyncStatus = useSetRecoilState(syncStatusAtom);

    const adicionarTarefa = async (tarefa: Todo) => {
        const tempId = `temp-${Date.now()}`;
        const temporario: Todo = { ...tarefa, _id: tempId };
        setTarefas((tarefasAtuais) => [...tarefasAtuais, temporario]);
        adicionarPendencia({ id: tempId, action: "criar", tarefa:temporario});

        const { _id: _, ...payload } = tarefa;

        try {
            const tarefaCriada =await criarTarefa(payload as Todo);
            removerPendencia(tempId, "criar");
            setTarefas((tarefasAtuais) => tarefasAtuais.map((item) => item._id === tempId ? { ...item, ...tarefaCriada} : item));
            
        }catch (erro) {
            console.error("Criar falhou:", erro);
            setSyncStatus("offline");
        }
    };

    return adicionarTarefa;
}