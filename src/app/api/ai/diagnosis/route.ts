import { NextRequest, NextResponse } from 'next/server'

const PROMPT_DIAGNOSIS = `Você é um planejador financeiro especializado em ajudar pessoas físicas endividadas no Brasil.

Seu papel é analisar a situação financeira do usuário e criar um diagnóstico claro e empático.

REGRAS IMPORTANTES:
- Use linguagem simples, clara e sem termos técnicos.
- Nunca julgue, critique ou culpe o usuário.
- Seja direto, honesto e empático.
- Explique tudo como se estivesse falando com alguém leigo.
- Foque sempre em soluções práticas.
- Considere a realidade do brasileiro médio.

TAREFAS:

1. Faça um diagnóstico financeiro simples:
   - Mostre quanto da renda está comprometida.
   - Classifique a situação como: Controlável, Zona de risco, ou Situação crítica

2. Explique claramente o principal problema financeiro do usuário.

3. Dê uma mensagem motivadora e realista, mostrando que é possível sair do vermelho com disciplina.

FORMATO DA RESPOSTA:
- Use títulos claros.
- Use listas quando necessário.
- Seja objetivo, mas humano.
- Máximo 300 palavras.`

export async function POST(request: NextRequest) {
  try {
    const { renda, gastosFixos, gastosVariaveis, dividas } = await request.json()

    const totalGastos = gastosFixos + gastosVariaveis
    const totalDividas = dividas.reduce((acc: number, d: any) => acc + d.valor, 0)
    const percentualComprometido = ((totalGastos + totalDividas) / renda) * 100

    let riskLevel: 'controlável' | 'risco' | 'crítico' = 'controlável'
    if (percentualComprometido >= 80) {
      riskLevel = 'crítico'
    } else if (percentualComprometido >= 50) {
      riskLevel = 'risco'
    }

    const listaDividas = dividas
      .map((d: any) => `- ${d.tipo}: R$ ${d.valor.toFixed(2)} (juros: ${d.juros || 0}% ao mês)`)
      .join('\n')

    const prompt = `${PROMPT_DIAGNOSIS}

DADOS DO USUÁRIO:
Renda mensal: R$ ${renda.toFixed(2)}
Gastos fixos mensais: R$ ${gastosFixos.toFixed(2)}
Gastos variáveis mensais: R$ ${gastosVariaveis.toFixed(2)}
Dívidas:
${listaDividas}

Percentual da renda comprometida: ${percentualComprometido.toFixed(0)}%

Gere o diagnóstico agora:`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Você é um planejador financeiro empático e prático para brasileiros endividados.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    })

    if (!response.ok) {
      throw new Error('Erro ao chamar OpenAI API')
    }

    const data = await response.json()
    const diagnosisText = data.choices[0].message.content

    return NextResponse.json({
      diagnosisText,
      riskLevel,
      percentualComprometido: Math.round(percentualComprometido)
    })
  } catch (error: any) {
    console.error('Erro na API de diagnóstico:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar diagnóstico', details: error.message },
      { status: 500 }
    )
  }
}
