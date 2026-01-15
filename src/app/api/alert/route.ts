import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { descricao, valor, orcamento } = await request.json();

    const prompt = `Você é um assistente financeiro que monitora os gastos do usuário.

Analise o gasto abaixo e diga, em linguagem simples:
- Se é seguro ou perigoso.
- Qual impacto real no orçamento mensal.
- Um conselho curto e prático.

Gasto: ${descricao}
Valor: R$ ${valor.toFixed(2)}
Orçamento mensal: R$ ${orcamento.toFixed(2)}

Seja direto, empático e prático. Use emojis para deixar mais visual.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um assistente financeiro que ajuda pessoas a entenderem o impacto de seus gastos.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const alerta = completion.choices[0].message.content;

    return NextResponse.json({ alerta });
  } catch (error: any) {
    console.error('Erro no alerta:', error);
    return NextResponse.json(
      { error: 'Erro ao processar alerta', details: error.message },
      { status: 500 }
    );
  }
}
