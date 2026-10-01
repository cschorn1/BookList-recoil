import { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { tarefasAtom } from "../atoms/tarefasAtom";
import { syncStatusAtom } from "../atoms/syncStatusAtom";
import { atualizarTarefa, buscarTarefas, criarTarefa, removerTarefa } from "../services/api";
import { carregarPendencias, removerPendencia } from "../services/offlineSync";
import type { Todo } from "../types/Todo";

export function useTodoSync() {
    const [tarefas, setTarefas] = useRecoilState(tarefasAtom);
    const setSyncStatus = useSetRecoilState(syncStatusAtom);

    useEffect(() => {
        try {
            window.localStorage.setItem("tarefas", JSON.stringify(tarefas));
        } catch {
            // ignora falha de persistência local
        }
    }, [tarefas]);

    useEffect(() => {
        let cancelado = false;
        let sincronizando = false;

        async function sincronizar() {
            if (cancelado || sincronizando) {
                return;
            }

            if (!window.navigator.onLine) {
                setSyncStatus("offline");
                return;
            }

            sincronizando = true;
            setSyncStatus("sincronizando");

            try {
                const tarefasApiAntes = await buscarTarefas();
                const idsApiConhecidos = new Set(tarefasApiAntes.map((tarefa) => tarefa._id).filter(Boolean));
                const pendencias = carregarPendencias();
                const idsMigrados = new Map<string, string>();

                for (const pendencia of pendencias) {
                    if (cancelado) {
                        return;
                    }

                    if (pendencia.action === "criar" && pendencia.tarefa) {
                        const { _id: _, ...payload } = pendencia.tarefa;
                        const tarefaCriada = await criarTarefa(payload as Todo);
                        removerPendencia(pendencia.id, "criar");
                        if (tarefaCriada._id) {
                            idsApiConhecidos.add(tarefaCriada._id);
                        }

                        const tarefaAtualizada = { ...pendencia.tarefa, ...tarefaCriada };
                        const locais = JSON.parse(window.localStorage.getItem("tarefas") || "[]") as Todo[];
                        window.localStorage.setItem("tarefas", JSON.stringify(
                            locais.map((local) => local._id === pendencia.id ? tarefaAtualizada : local)
                        ));
                        setTarefas((atuais) => atuais.map((local) => local._id === pendencia.id ? tarefaAtualizada : local));
                    }

                    if (pendencia.action === "atualizar" && pendencia.tarefa) {
                        const { _id: _, ...payload } = pendencia.tarefa;
                        const idAtual = idsMigrados.get(pendencia.id) ?? pendencia.id;

                        if (idsApiConhecidos.has(idAtual)) {
                            await atualizarTarefa(idAtual, payload as Todo);
                        } else {
                            const tarefaCriada = await criarTarefa(payload as Todo);
                            if (tarefaCriada._id) {
                                idsMigrados.set(pendencia.id, tarefaCriada._id);
                                idsApiConhecidos.add(tarefaCriada._id);
                                const tarefaAtualizada = { ...pendencia.tarefa, ...tarefaCriada };
                                const locais = JSON.parse(window.localStorage.getItem("tarefas") || "[]") as Todo[];
                                window.localStorage.setItem("tarefas", JSON.stringify(
                                    locais.map((local) => local._id === pendencia.id ? tarefaAtualizada : local)
                                ));
                                setTarefas((atuais) => atuais.map((local) => local._id === pendencia.id ? tarefaAtualizada : local));
                            }
                        }
                        removerPendencia(pendencia.id, "atualizar");
                    }

                    if (pendencia.action === "remover") {
                        const idAtual = idsMigrados.get(pendencia.id) ?? pendencia.id;
                        if (idsApiConhecidos.has(idAtual)) {
                            await removerTarefa(idAtual);
                            idsApiConhecidos.delete(idAtual);
                        }
                        removerPendencia(pendencia.id, "remover");
                    }
                }

                const dadosApi = await buscarTarefas();

                if (cancelado) {
                    return;
                }

                const locaisAtualizados = JSON.parse(window.localStorage.getItem("tarefas") || "[]");
                const tarefasLocaisSemId = (Array.isArray(locaisAtualizados) ? locaisAtualizados : [])
                    .filter((local: Todo) => !local._id || local._id.startsWith("temp-"));
                const idsApi = new Set(dadosApi.map((tarefa) => tarefa._id));
                const tarefasTemporarias = tarefasLocaisSemId.filter((local: Todo) => !idsApi.has(local._id));
                const mergeFinal = [...dadosApi, ...tarefasTemporarias];

                setTarefas(mergeFinal);
                setSyncStatus("sincronizado");
            } catch {
                if (!cancelado) {
                    setSyncStatus("offline");
                }
            } finally {
                sincronizando = false;
            }
        }

        const iniciarSincronizacao = window.setTimeout(() => {
            void sincronizar();
        }, 0);
        const intervalo = window.setInterval(() => {
            void sincronizar();
        }, 30000);
        window.addEventListener("online", sincronizar);

        return () => {
            cancelado = true;
            window.clearTimeout(iniciarSincronizacao);
            window.clearInterval(intervalo);
            window.removeEventListener("online", sincronizar);
        };
    }, [setSyncStatus, setTarefas]);
}
