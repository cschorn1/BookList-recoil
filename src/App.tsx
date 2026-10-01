import TodoItem from './components/TodoItem';
import TodoForm from './components/TodoForm';
import SyncIndicator from './components/SyncIndicator';
import { useRecoilValue, useSetRecoilState } from "recoil";
import { filtroAtom } from "./atoms/filtroAtom";
import { tarefasFiltradasSelector } from "./selectors/tarefasFiltradasSelector";
import { useToggleTodo } from "./hooks/useToggleTodo";
import { useDeleteTodo } from "./hooks/useDeleteTodo";
import { useTodoSync } from './hooks/useTodoSync';

function AppConteudo() {
  const concluirTarefa = useToggleTodo();
  const excluirTarefa = useDeleteTodo();
  const tarefasFiltradas = useRecoilValue(tarefasFiltradasSelector);
  const filtro = useRecoilValue(filtroAtom);
  const alterarFiltro = useSetRecoilState(filtroAtom);

  useTodoSync();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="bg-slate-800 text-white shadow-md">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <h1 className="text-2xl font-bold">TodoList</h1>
        </div>
      </header>

      <main>
        <section className="mb-10 rounded-xl bg-slate-200 px-6 py-8 text-center shadow-sm">
          <h2 className="text-3xl font-bold">Lista de Tarefas</h2>
          <p className="mt-2 text-slate-600">Confira sua lista de tarefas</p>
        </section>

        <TodoForm />

        <div className="mx-auto mt-6 flex max-w-2xl justify-center gap-3">
          {[
            { valor: 'todas', rotulo: 'Todas' },
            { valor: 'concluidas', rotulo: 'Concluídas' },
            { valor: 'pendentes', rotulo: 'Pendentes' }
          ].map((opcao) => (
            <button
              key={opcao.valor}
              type="button"
              onClick={() => alterarFiltro(opcao.valor as 'todas' | 'concluidas' | 'pendentes')}
              className={`rounded-full px-4 py-2 font-medium transition ${
                filtro === opcao.valor
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-700 shadow-sm'
              }`}
            >
              {opcao.rotulo}
            </button>
          ))}
        </div>

        <section className="mt-10 px-4 md:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tarefasFiltradas.map((tarefa) => (
              <TodoItem
                key={tarefa._id}
                tarefa={tarefa}
                excluirTarefa={excluirTarefa}
                concluirTarefa={concluirTarefa}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-slate-800 py-6 text-center text-white">
        <p className="font-bold text-2xl">TodoList</p>
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
