// src/types/conferencia.ts

export interface ItemConferencia {
    codProd: number;
    descricao: string;
    unidade: string;
    qtdEsperada: number;
    qtdConferida: number;
    conferido: boolean;
  }
  
  export interface DetalhePedido {
    nunota: number;
    statusConferencia: string; // "AC", "A", "R", etc.
    nomeConferente?: string | null;
    avatarUrlConferente?: string | null;
    itens: ItemConferencia[];
  }
  