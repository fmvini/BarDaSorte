# Bar da Sorte

Aplicação React para descobrir receitas de drinks, pesquisar por categorias,
montar uma despensa de ingredientes e salvar receitas favoritas.

Os dados das receitas são obtidos pela [TheCocktailDB](https://www.thecocktaildb.com/).

## Requisitos

- Node.js 20 ou superior
- npm

## Instalação

Na pasta do projeto, instale as dependências:

```bash
npm install
```

Opcionalmente, crie um arquivo `.env` para informar uma chave da TheCocktailDB:

```env
VITE_COCKTAIL_API_KEY=1
```

Se a variável não for informada, a aplicação usa a chave pública padrão `1`.

## Executando em desenvolvimento

```bash
npm run dev
```

Depois, abra a URL exibida pelo Vite, normalmente
`http://localhost:5173`.

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento com Hot Module Replacement. |
| `npm run build` | Gera a versão otimizada para produção na pasta `dist`. |
| `npm run preview` | Executa localmente a versão gerada pelo build. |
| `npm run lint` | Verifica o código com ESLint. |

## Bibliotecas instaladas

### Dependências de produção

- **React** e **React DOM**: construção e renderização da interface.
- **React Router DOM**: navegação entre Home, busca, despensa, favoritos e
  detalhes dos drinks.
- **Motion**: animações e interação de arraste do carrossel de drinks.

### Dependências de desenvolvimento

- **Vite**: servidor de desenvolvimento e ferramenta de build.
- **@vitejs/plugin-react**: integração do React com o Vite.
- **ESLint**: análise estática e padronização do código.
- **eslint-plugin-react-hooks**: validação das regras de Hooks do React.
- **eslint-plugin-react-refresh**: validação de compatibilidade com Fast Refresh.
- **@eslint/js** e **globals**: configuração base do ESLint.
- **@types/react** e **@types/react-dom**: tipos auxiliares do ecossistema
  React.

## Estrutura principal

```text
src/
├── components/   # Componentes reutilizáveis, incluindo cards e carrossel
├── context/      # Contextos de tema, favoritos e despensa
├── hooks/        # Hooks customizados
├── pages/        # Páginas da aplicação
├── services/     # Comunicação com a API de drinks
├── styles/       # Variáveis e estilos globais
└── utils/        # Normalização e funções auxiliares
```

## Funcionalidades

- Carrossel de drinks em destaque com navegação por setas e arraste.
- Busca por nome e categorias.
- Filtro de drinks sem álcool.
- Despensa de ingredientes com sugestões de receitas.
- Favoritos persistidos no navegador.
- Tema claro e escuro.
- Página de detalhes de cada drink.
