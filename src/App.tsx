import BookList from './components/BookList';
import BookForm from './components/BookForm';
import SyncIndicator from './components/SyncIndicator';
import { useRecoilValue, useSetRecoilState } from "recoil";
import { filtroAtom } from "./atoms/filtroAtom";
import { livrosFiltradosSelector } from "./selectors/livrosFiltradasSelector";
import { useToggleBook } from "./hooks/useToggleBook";
import { useDeleteBook } from "./hooks/useDeleteBooK";
import { useBookSync } from './hooks/useBookSync';

function AppConteudo() {
  const concluirLivro = useToggleBook();
  const excluirLivro = useDeleteBook();
  const livrosFiltrados = useRecoilValue(livrosFiltradosSelector);
  const filtro = useRecoilValue(filtroAtom);
  const alterarFiltro = useSetRecoilState(filtroAtom);

  useBookSync();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="bg-slate-800 text-white shadow-md">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <h1 className="text-2xl font-bold">BookList</h1>
        </div>
      </header>

      <main>
        <section className="mb-10 rounded-xl bg-slate-200 px-6 py-8 text-center shadow-sm">
          <h2 className="text-3xl font-bold">Lista de Livros</h2>
          <p className="mt-2 text-slate-600">Confira sua lista de livros</p>
        </section>

        <BookForm />

        <div className="mx-auto mt-6 flex max-w-3xl flex-col items-center gap-5">
          <div className="flex flex-wrap justify-center gap-3" role="group" aria-label="Filtrar por status">
            {([
              { valor: "todos", rotulo: "Todos" },
              { valor: "Lido", rotulo: "Lido" },
              { valor: "Não lido", rotulo: "Não lido" },
            ] as const).map((opcao) => (
              <button
                key={opcao.valor}
                type="button"
                aria-pressed={filtro.status === opcao.valor}
                onClick={() =>
                  alterarFiltro((filtrosAtuais) => ({
                    ...filtrosAtuais,
                    status: opcao.valor,
                  }))
                }
                className={`min-w-28 rounded-full px-6 py-3 text-base font-medium transition ${
                  filtro.status === opcao.valor
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-700 shadow-sm"
                }`}
              >
                {opcao.rotulo}
              </button>
            ))}
          </div>

          <label className="flex flex-col items-center gap-2">
            <span className="font-medium">Gênero</span>
            <select
              value={filtro.genre}
              onChange={(event) => {
                const genre = event.currentTarget.value as typeof filtro.genre;
                alterarFiltro((filtrosAtuais) => ({ ...filtrosAtuais, genre }));
              }}
              className="w-56 rounded-lg border border-slate-300 bg-white px-4 py-2"
            >
              <option value="todos">Todos</option>
              <option value="romance">Romance</option>
              <option value="infantil">Infantil</option>
              <option value="terror">Terror</option>
              <option value="autoajuda">Autoajuda</option>
              <option value="outro">Outro</option>
            </select>
          </label>
        </div>

        <section className="mt-10 px-4 md:px-6 lg:px-8">
          <BookList
            livros={livrosFiltrados}
            excluirLivro={excluirLivro}
            concluirLivro={concluirLivro}
          />
        </section>
      </main>

      <footer className="bg-slate-800 py-6 text-center text-white">
        <p className="font-bold text-2xl">BookList</p>
      </footer>

      <SyncIndicator />
    </div>
  );
}

function App() {
  return (
      <AppConteudo />
  );
}

export default App;
