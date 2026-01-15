import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { renda, gastosFixos, gastosVariaveis, dividas } = await request.json();

    // Formatar lista de dívidas
    const listaDividas = dividas
      .map((d: any, i: number) => 
        `${i + 1}. ${d.nome}: R$ ${d.valor.toFixed(2)} (juros: ${d.juros}% ao mês)${d.parcelas ? ` - ${d.parcelas}x` : ''}`
      )
      .join('\n');

    const prompt = `Você é um planejador financeiro especializado em ajudar pessoas físicas endividadas no Brasil.

Seu papel é analisar a situação financeira do usuário e criar um plano prático, humano e realista para sair das dívidas.

REGRAS IMPORTANTES:
- Use linguagem simples, clara e sem termos técnicos.
- Nunca julgue, critique ou culpe o usuário.
- Seja direto, honesto e empático.
- Explique tudo como se estivesse falando com alguém leigo.
- Foque sempre em soluções práticas.
- Considere a realidade do brasileiro médio.
- Não incentive investimentos arriscados.
- Priorize sobrevivência financeira, organização e saída das dívidas.

DADOS DO USUÁRIO:
Renda mensal: R$ ${renda.toFixed(2)}
Gastos fixos mensais: R$ ${gastosFixos.toFixed(2)}
Gastos variáveis mensais: R$ ${gastosVariaveis.toFixed(2)}
Dívidas:
${listaDividas}

TAREFAS OBRIGATÓRIAS:

1. Faça um diagnóstico financeiro simples:
   - Mostre quanto da renda está comprometida.
   - Classifique a situação como:
     • Controlável
     • Zona de risco
     • Situação crítica

2. Explique claramente o principal problema financeiro do usuário.

3. Crie um plano de saída das dívidas:
   - Escolha a melhor estratégia (bola de neve ou avalanche).
   - Diga quais dívidas pagar primeiro e por quê.
   - Informe valor mensal recomendado.
   - Informe prazo estimado para sair das dívidas.

4. Monte um orçamento mensal realista:
   - Quanto pode gastar com despesas essenciais.
   - Quanto pode gastar com variáveis.
   - Quanto deve ir para dívidas.
   - Quanto (se possível) reservar.

5. Dê alertas importantes:
   - Gastos perigosos.
   - Parcelamentos ruins.
   - Riscos de continuar no mesmo padrão.

6. Finalize com uma mensagem motivadora e realista, mostrando que é possível sair do vermelho com disciplina.

FORMATO DA RESPOSTA:
- Use títulos claros com emojis.
- Use listas quando necessário.
- Use exemplos práticos.
- Seja objetivo, mas humano.

Nunca use termos técnicos financeiros.
Nunca cite leis ou bancos.
Nunca recomende empréstimos sem extrema necessidade.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um planejador financeiro empático e prático, especializado em ajudar brasileiros endividados.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const analise = completion.choices[0].message.content;

    return NextResponse.json({ analise });
  } catch (error: any) {
    console.error('Erro na análise:', error);
    return NextResponse.json(
      { error: 'Erro ao processar análise financeira', details: error.message },
      { status: 500 }
    );
  }
}
