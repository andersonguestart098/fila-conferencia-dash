// src/api/conferencia.ts
import { api } from "./client";
import type { DetalhePedido } from "../types/conferencia";

export async function buscarPedidosPendentes(): Promise<DetalhePedido[]> {
  const resp = await api.get<DetalhePedido[]>("/api/conferencia/pedidos-pendentes");

  // 🔥 LOGA TUDO QUE VEIO DO BACKEND
  console.log(
    "[DEBUG] /api/conferencia/pedidos-pendentes - resposta bruta:",
    resp.data
  );

  if (resp.data && resp.data.length > 0) {
    console.log(
      "[DEBUG] Primeiro pedido:",
      JSON.stringify(resp.data[0], null, 2)
    );
  } else {
    console.log("[DEBUG] Nenhum pedido retornado pela API.");
  }

  return resp.data;
}
