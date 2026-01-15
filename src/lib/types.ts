// Tipos para o sistema de planejamento financeiro

export interface Divida {
  nome: string;
  valor: number;
  juros: number;
  parcelas?: number;
}

export interface DadosFinanceiros {
  renda: number;
  gastosFixos: number;
  gastosVariaveis: number;
  dividas: Divida[];
}

export interface Gasto {
  descricao: string;
  valor: number;
}

export interface Simulacao {
  cenario: string;
  dadosFinanceiros: DadosFinanceiros;
}

export interface AnaliseResponse {
  diagnostico: string;
  problema: string;
  plano: string;
  orcamento: string;
  alertas: string;
  mensagemFinal: string;
}
