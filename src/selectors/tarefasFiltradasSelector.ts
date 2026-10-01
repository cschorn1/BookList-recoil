import {selector} from "recoil";
import {tarefasAtom} from "../atoms/tarefasAtom";
import {filtroAtom} from "../atoms/filtroAtom";

export const tarefasFiltradasSelector = selector({
    key: "tarefasFiltradasSelector",
    get: ({get}) => {
        const tarefas = get(tarefasAtom);
        const filtro = get(filtroAtom);

        if (filtro === "concluidas") {
            return tarefas.filter((tarefa) => tarefa.concluida);
        }

        if (filtro === "pendentes") {
            return tarefas.filter((tarefa) => !tarefa.concluida);
        }

        return tarefas;
    },
});