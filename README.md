# Todo List com Recoil

Aplicação de gerenciamento de tarefas desenvolvida com React, TypeScript e Recoil. As tarefas são mantidas localmente e sincronizadas com uma API CrudCrud quando há conexão.

## Funcionalidades

- Adicionar tarefas com nome e descrição opcional.
- Marcar tarefas como concluídas ou pendentes.
- Remover tarefas.
- Filtrar a lista por todas, concluídas ou pendentes.
- Persistir tarefas e operações pendentes no `localStorage`.
- Continuar usando a aplicação offline e reenviar operações quando a conexão voltar.
- Exibir o estado da sincronização: sincronizando, sincronizado ou offline.
- Layout responsivo.

## Tecnologias

- React 18.2
- TypeScript
- Recoil 0.7
- Vite
- Tailwind CSS
- CrudCrud como API REST

## Requisitos

- Node.js 18 ou superior
- npm

## Instalação e execução

Na pasta do projeto, execute:

```bash
npm install
npm run dev
```

O Vite exibirá no terminal o endereço local da aplicação, normalmente `http://localhost:5173`.

Para criar o build de produção:

```bash
npm run build
```

Para executar o lint:

```bash
npm run lint
```

## Organização do código

```text
src/
├── atoms/
│   ├── filtroAtom.ts
│   ├── syncStatusAtom.ts
│   └── tarefasAtom.ts
├── components/
│   ├── SyncIndicator.tsx
│   ├── TodoForm.tsx
│   ├── TodoItem.tsx
│   └── TodoList.tsx
├── hooks/
│   ├── useAddTodo.ts
│   ├── useDeleteTodo.ts
│   ├── useTodoSync.ts
│   └── useToggleTodo.ts
├── selectors/
│   └── tarefasFiltradasSelector.ts
├── services/
│   ├── api.ts
│   └── offlineSync.ts
├── types/
│   └── Todo.ts
├── App.tsx
└── main.tsx
```

O `RecoilRoot`, em `main.tsx`, fornece o estado global. `tarefasAtom` armazena as tarefas, `filtroAtom` armazena o filtro selecionado e `tarefasFiltradasSelector` calcula a lista exibida.

## Sincronização offline

As ações são aplicadas primeiro no estado local para que a interface continue utilizável sem conexão. Quando a API falha, a operação fica salva na fila `tarefasPendentes` no `localStorage`. O sincronizador tenta reenviar as operações ao detectar que a conexão voltou e também faz novas tentativas periódicas.

Depois de processar a fila, a aplicação consulta a API e atualiza a lista local. Operações pendentes só são removidas da fila depois de processadas com sucesso.

## Configuração da API

A URL do CrudCrud está definida em `src/services/api.ts`. URLs do CrudCrud são temporárias; quando uma expirar, substitua a URL base nesse arquivo. Cada URL representa uma base de dados diferente, então IDs da URL antiga não existem automaticamente na nova. Não compartilhe publicamente URLs que ainda estejam ativas.

## Observação

O CrudCrud é um serviço externo de demonstração. Sua disponibilidade e a validade das URLs não são controladas por esta aplicação.