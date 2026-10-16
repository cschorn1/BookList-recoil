import { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { livrosAtom, lerLivrosLocais } from "../atoms/booksAtom";
import { listaMock } from "../data/listaMock";
import { syncStatusAtom } from "../atoms/syncStatusAtom";
import { atualizarLivro, buscarLivros, addLivro, removerLivro } from "../services/bookApi";
import { carregarPendencias, removerPendencia } from "../services/offlineSync";
import type { NewBook } from "../types/Book";

export function useBookSync() {
    const [livros, setLivros] = useRecoilState(livrosAtom);
    const setSyncStatus = useSetRecoilState(syncStatusAtom);

    useEffect(() => {
        try {
            window.localStorage.setItem("livros", JSON.stringify(livros));
        } catch {
            // ignora falha de persistência local
        }
    }, [livros]);

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
                let livrosApiAntes = await buscarLivros();

                if (livrosApiAntes.length === 0) {
                    const mocksLocais = lerLivrosLocais().filter((livro) => livro.isMock);
                    const mocksParaSemear: NewBook[] = mocksLocais.length > 0
                        ? mocksLocais.map(({ _id, ...livro }) => livro)
                        : listaMock;

                    for (const livroMock of mocksParaSemear) {
                        if (cancelado) {
                            return;
                        }

                        await addLivro(livroMock);
                    }

                    livrosApiAntes = await buscarLivros();
                }

                const idsApiConhecidos = new Set(livrosApiAntes.map((livro) => livro._id).filter(Boolean));
                const pendencias = carregarPendencias();
                const idsMigrados = new Map<string, string>();

                for (const pendencia of pendencias) {
                    if (cancelado) {
                        return;
                    }

                    if (pendencia.action === "criar" && pendencia.livro) {
                        const { _id: _, ...payload } = pendencia.livro;
                        const livroCriado = await addLivro(payload, pendencia.id);
                        removerPendencia(pendencia.id, "criar");
                        if (livroCriado._id) {
                            idsApiConhecidos.add(livroCriado._id);
                        }

                        const livroAtualizado = { ...pendencia.livro, ...livroCriado };
                        const locais = lerLivrosLocais();
                        window.localStorage.setItem("livros", JSON.stringify(
                            locais.map((local) => local._id === pendencia.id ? livroAtualizado : local)
                        ));
                        setLivros((atuais) => atuais.map((local) => local._id === pendencia.id ? livroAtualizado : local));
                    }

                    if (pendencia.action === "atualizar" && pendencia.livro) {
                        const { _id: _, ...payload } = pendencia.livro;
                        const idAtual = idsMigrados.get(pendencia.id) ?? pendencia.id;

                        if (idsApiConhecidos.has(idAtual)) {
                            await atualizarLivro(idAtual, payload);
                        } else {
                            const livroCriado = await addLivro(payload, idAtual);
                            if (livroCriado._id) {
                                idsMigrados.set(pendencia.id, livroCriado._id);
                                idsApiConhecidos.add(livroCriado._id);
                                const livroAtualizado = { ...pendencia.livro, ...livroCriado };
                                const locais = lerLivrosLocais();
                                window.localStorage.setItem("livros", JSON.stringify(
                                    locais.map((local) => local._id === pendencia.id ? livroAtualizado : local)
                                ));
                                setLivros((atuais) => atuais.map((local) => local._id === pendencia.id ? livroAtualizado : local));
                            }
                        }
                        removerPendencia(pendencia.id, "atualizar");
                    }

                    if (pendencia.action === "remover") {
                        const idAtual = idsMigrados.get(pendencia.id) ?? pendencia.id;
                        if (idsApiConhecidos.has(idAtual)) {
                            await removerLivro(idAtual);
                            idsApiConhecidos.delete(idAtual);
                        }
                        removerPendencia(pendencia.id, "remover");
                    }
                }

                const dadosApi = await buscarLivros();

                if (cancelado) {
                    return;
                }

                const livrosLocaisSemId = lerLivrosLocais()
                    .filter((local) => local._id.startsWith("temp-"));
                const idsApi = new Set(dadosApi.map((livro) => livro._id));
                const livrosTemporarios = livrosLocaisSemId.filter((local) => !idsApi.has(local._id));
                const mergeFinal = [...dadosApi, ...livrosTemporarios];

                setLivros(mergeFinal);
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
    }, [setSyncStatus, setLivros]);
}
