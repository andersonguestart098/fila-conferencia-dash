// src/types/conferencia.ts
export interface ItemConferencia {
  sequencia: number;
  codProd: number;
  descricao: string;
  unidade: string;

  // mesmas chaves do DTO do backend
  qtdAtual?: number | null;      // TGFITE.QTDNEG (depois do corte)
  qtdEsperada?: number | null;   // TGFCOI2.QTDCONFVOLPAD
  qtdConferida?: number | null;  // TGFCOI2.QTDCONF

  // 👇 NOVO: quantidade original na nota, antes de qualquer corte
  qtdOriginal?: number | null;

  conferido?: boolean;
}


export interface DetalhePedido {
  nunota: number;
  numNota?: number | null;
  nomeParc?: string | null;
  statusConferencia: string;

  itens: ItemConferencia[];

  nomeConferente?: string | null;
  avatarUrlConferente?: string | null;

  codVendedor?: number | null;
  nomeVendedor?: string | null;
}
