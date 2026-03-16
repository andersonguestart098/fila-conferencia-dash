import { api } from "./client";
import type { DetalhePedido } from "../types/conferencia";

type PedidosResponse = {
  pedidos: DetalhePedido[];
  total: number;
  page: number;
  pageSize: number;
};

let pendentesController: AbortController | null = null;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getComRetry<T>(
  url: string,
  config: any,
  tentativas = 2
): Promise<T> {
  let lastErr: any;

  for (let i = 0; i <= tentativas; i++) {
    try {
      const resp = await api.get<T>(url, config);
      return resp.data as T;
    } catch (err: any) {
      lastErr = err;

      const isCanceled =
        err?.code === "ERR_CANCELED" ||
        err?.message?.toLowerCase?.().includes("canceled");

      if (isCanceled) throw err;

      const isTimeout =
        err?.code === "ECONNABORTED" ||
        String(err?.message || "").includes("timeout");

      const isNetwork = !err?.response;
      const podeRetry = isTimeout || isNetwork;

      if (!podeRetry || i === tentativas) break;

      await sleep(400 * (i + 1));
    }
  }

  throw lastErr;
}

type ConferenteByNunota = Record<number, { codUsuario: number; nome: string }>;

function loadConferenteByNunota(): ConferenteByNunota {
  try {
    return JSON.parse(localStorage.getItem("conferenteByNunota") || "{}");
  } catch {
    return {};
  }
}

function saveConferenteByNunota(next: ConferenteByNunota) {
  try {
    localStorage.setItem("conferenteByNunota", JSON.stringify(next));
  } catch {
    // ignore
  }
}

export async function buscarPedidosPendentes(): Promise<DetalhePedido[] | null> {
  try {
    if (pendentesController) pendentesController.abort();
    pendentesController = new AbortController();

    const url = "/api/conferencia/pedidos-pendentes";

    const data = await getComRetry<PedidosResponse | DetalhePedido[]>(
      url,
      {
        signal: pendentesController.signal,
        timeout: 60000,
      },
      1
    );

    if (data == null) {
      console.warn("⚠ [API] Sem data, retornando lista vazia");
      return [];
    }

    // ✅ formato novo
    if (!Array.isArray(data) && Array.isArray(data.pedidos)) {
      console.log("✅ [API] Dados recebidos do backend (novo formato):", {
        total: data.total,
        page: data.page,
        pageSize: data.pageSize,
        pedidos: data.pedidos.length,
      });

      const pedidos = data.pedidos as DetalhePedido[];

      const conferenteByNunota = loadConferenteByNunota();
      const updatedConferenteByNunota = { ...conferenteByNunota };
      let atualizados = 0;

      pedidos.forEach((pedido) => {
        const idBackend = (pedido as any).conferenteId;
        const nomeBackend = (pedido as any).conferenteNome;
        const nomeConferenteOld = pedido.nomeConferente;

        if (idBackend && nomeBackend) {
          updatedConferenteByNunota[pedido.nunota] = {
            codUsuario: idBackend,
            nome: nomeBackend,
          };
          atualizados++;
        } else if (
          nomeConferenteOld &&
          nomeConferenteOld !== "null" &&
          nomeConferenteOld !== "-" &&
          nomeConferenteOld !== ""
        ) {
          const conferenteEncontrado = [
            { codUsuario: 1, nome: "Manoel" },
            { codUsuario: 2, nome: "Anderson" },
            { codUsuario: 3, nome: "Felipe" },
            { codUsuario: 4, nome: "Matheus" },
            { codUsuario: 5, nome: "Cristiano" },
            { codUsuario: 6, nome: "Cristiano Sanhudo" },
            { codUsuario: 7, nome: "Eduardo" },
            { codUsuario: 8, nome: "Everton" },
            { codUsuario: 9, nome: "Maximiliano" },
          ].find((c) => c.nome.toLowerCase() === nomeConferenteOld.toLowerCase());

          if (conferenteEncontrado) {
            updatedConferenteByNunota[pedido.nunota] = conferenteEncontrado;
            atualizados++;
          } else if (!conferenteByNunota[pedido.nunota]) {
            updatedConferenteByNunota[pedido.nunota] = {
              codUsuario: 0,
              nome: nomeConferenteOld,
            };
            atualizados++;
          }
        }
      });

      if (atualizados > 0) {
        saveConferenteByNunota(updatedConferenteByNunota);
      }

      return pedidos;
    }

    // ✅ formato antigo
    if (Array.isArray(data)) {
      console.log("✅ [API] Dados recebidos do backend (formato antigo):", {
        pedidos: data.length,
      });

      return data as DetalhePedido[];
    }

    console.warn("⚠ [API] Resposta inesperada, retornando lista vazia", data);
    return [];
  } catch (error: any) {
    const isCanceled =
      error?.code === "ERR_CANCELED" ||
      error?.message?.toLowerCase?.().includes("canceled");

    if (isCanceled) {
      console.log("🟦 [API] Request cancelado (novo poll iniciou).");
      return null;
    }

    console.error("❌ [API] ERRO ao buscar pedidos:", {
      message: error?.message,
      code: error?.code,
      status: error?.response?.status,
      url: error?.config?.url,
    });

    return null;
  } finally {
    pendentesController = null;
  }
}

export { loadConferenteByNunota, saveConferenteByNunota };