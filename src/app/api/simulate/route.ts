import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { cenario, dadosFinanceiros } = await request.json();

    const { renda, gastosFixos, gastosVariaveis, dividas } = dadosFinanceiros;

    const listaDividas = dividas
      .map((d: any, i: number) => 
        `${i + 1}. ${d.nome}: R$ ${d.valor.toFixed(2)} (juros: ${d.juros}% ao mês)`
      )
      .join('\n');

    const prompt = `Você é um planejador financeiro.

Simule o cenário abaixo e explique claramente:
- Impacto no orçamento.
- Impacto no prazo para sair das dívidas.
- Se a decisão ajuda ou atrapalha.

Situação atual:
Renda mensal: R$ ${renda.toFixed(2)}
Gastos fixos: R$ ${gastosFixos.toFixed(2)}
Gastos variáveis: R$ ${gastosVariaveis.toFixed(2)}
Dívidas:
${listaDividas}

Simulação:
${cenario}

Seja claro, direto e use linguagem simples. Use emojis para facilitar a leitura.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um planejador financeiro que ajuda pessoas a entenderem o impacto de suas decisões financeiras.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const simulacao = completion.choices[0].message.content;

    return NextResponse.json({ simulacao });
  } catch (error: any) {
    console.error('Erro na simulação:', error);
    return NextResponse.json(
      { error: 'Erro ao processar simulação', details: error.message },
      { status: 500 }
    );
  }
}
