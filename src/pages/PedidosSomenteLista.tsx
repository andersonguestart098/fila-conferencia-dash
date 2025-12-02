import { useFilaConferencia } from "../hooks/useFilaConferencia";
import PedidoList from "../components/PedidoList";

export default function PedidosSomenteLista() {
  const { pedidos, loadingInicial, erro, selecionado, setSelecionado } =
    useFilaConferencia();

  return (
    <div className="app-root">
      <header className="topbar">
        <div className="topbar-left">
          <span className="topbar-logo">📦</span>
          <div>
            <div className="topbar-title">Fila de Conferência</div>
            <div className="topbar-subtitle">Visão: Lista Simples</div>
          </div>
        </div>

        <div className="topbar-right">
          <span className="topbar-badge">Pendentes: {pedidos.length}</span>
          {erro && pedidos.length > 0 && (
            <span className="topbar-warning">
              ⚠ {erro} (mantendo últimos dados)
            </span>
          )}
        </div>
      </header>

      <main className="main-content">
        <section className="list-pane">
          <PedidoList
            pedidos={pedidos}
            loadingInicial={loadingInicial}
            erro={erro}
            selecionado={selecionado}
            onSelect={setSelecionado}
          />
        </section>
        {/* nada na direita */}
      </main>
    </div>
  );
}
