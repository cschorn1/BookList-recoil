import { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { livrosAtom } from "../atoms/booksAtom";
import { listaMock } from "../data/listaMock";
import { syncStatusAtom } from "../atoms/syncStatusAtom";
import { atualizarLivro, buscarLivros, addLivro, removerLivro } from "../services/bookApi";
import { carregarPendencias, removerPendencia } from "../services/offlineSync";
import type { Book } from "../types/Book";

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
                    const livrosLocaisSalvos = JSON.parse(
                        window.localStorage.getItem("livros") || "[]"
                    ) as Book[];
                    const mocksLocais = Array.isArray(livrosLocaisSalvos)
                        ? livrosLocaisSalvos.filter((livro) => livro.isMock)
                        : [];
                    const mocksParaSemear = mocksLocais.length > 0 ? mocksLocais : listaMock;

                    for (const livroMock of mocksParaSemear) {
                        if (cancelado) {
                            return;
                        }

                        const { _id: _, ...payload } = livroMock;
                        await addLivro(payload);
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
                        const livroCriado = await addLivro(payload as Book);
                        removerPendencia(pendencia.id, "criar");
                        if (livroCriado._id) {
                            idsApiConhecidos.add(livroCriado._id);
                        }

                        const livroAtualizado = { ...pendencia.livro, ...livroCriado };
                        const locais = JSON.parse(window.localStorage.getItem("livros") || "[]") as Book[];
                        window.localStorage.setItem("livros", JSON.stringify(
                            locais.map((local) => local._id === pendencia.id ? livroAtualizado : local)
                        ));
                        setLivros((atuais) => atuais.map((local) => local._id === pendencia.id ? livroAtualizado : local));
                    }

                    if (pendencia.action === "atualizar" && pendencia.livro) {
                        const { _id: _, ...payload } = pendencia.livro;
                        const idAtual = idsMigrados.get(pendencia.id) ?? pendencia.id;

                        if (idsApiConhecidos.has(idAtual)) {
                            await atualizarLivro(idAtual, payload as Book);
                        } else {
                            const livroCriado = await addLivro(payload as Book);
                            if (livroCriado._id) {
                                idsMigrados.set(pendencia.id, livroCriado._id);
                                idsApiConhecidos.add(livroCriado._id);
                                const livroAtualizado = { ...pendencia.livro, ...livroCriado };
                                const locais = JSON.parse(window.localStorage.getItem("livros") || "[]") as Book[];
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

                const locaisAtualizados = JSON.parse(window.localStorage.getItem("livros") || "[]");
                const livrosLocaisSemId = (Array.isArray(locaisAtualizados) ? locaisAtualizados : [])
                    .filter((local: Book) => !local._id || local._id.startsWith("temp-"));
                const idsApi = new Set(dadosApi.map((livro) => livro._id));
                const livrosTemporarios = livrosLocaisSemId.filter((local: Book) => !idsApi.has(local._id));
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
