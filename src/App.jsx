import EmptyState from "./components/ui/EmptyState/EmptyState";
import ErrorMessage from "./components/ui/ErrorMessage/ErrorMessage";
import Loader from "./components/ui/Loader/Loader";

export default function App() {
    return (<>
        <h1>Bar da Sorte</h1>
        <Loader></Loader>
        <ErrorMessage message="Não foi possível carregar os dados." onRetry={() => { }}></ErrorMessage>
        <EmptyState title="Nenhum item encontrado" action={<button>Adicionar</button>}></EmptyState>
    </>)
    }