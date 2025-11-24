// src/api/conferencia.ts
import { api } from "./client";
import type { DetalhePedido, ItemConferencia } from "../types/conferencia";


export async function buscarPedidosPendentes(): Promise<DetalhePedido[]> {
  const resp = await api.get<DetalhePedido[]>("/api/conferencia/pedidos-pendentes");
  return resp.data;
}
