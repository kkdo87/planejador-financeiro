import { NextRequest, NextResponse } from 'next/server'

const PROMPT_PLAN = `Você é um planejador financeiro especializado em ajudar pessoas físicas endividadas no Brasil.

Seu papel é criar um plano prático, humano e realista para sair das dívidas.

REGRAS IMPORTANTES:
- Use linguagem simples, clara e sem termos técnicos.
- Nunca julgue, critique ou culpe o usuário.
- Seja direto, honesto e empático.
- Explique tudo como se estivesse falando com alguém leigo.
- Foque sempre em soluções práticas.
- Considere a realidade do brasileiro médio.
- Não incentive investimentos arriscados.
- Priorize sobrevivência financeira, organização e saída das dívidas.

TAREFAS OBRIGATÓRIAS:

1. Crie um plano de saída das dívidas:
   - Escolha a melhor estratégia (bola de neve ou avalanche).
   - Diga quais dívidas pagar primeiro e por quê.
   - Informe valor mensal recomendado.
   - Informe prazo estimado para sair das dívidas.

2. Monte um orçamento mensal realista:
   - Quanto pode gastar com despesas essenciais.
   - Quanto pode gastar com variáveis.
   - Quanto deve ir para dívidas.
   - Quanto (se possível) reservar.

3. Dê alertas importantes:
   - Gastos perigosos.
   - Parcelamentos ruins.
   - Riscos de continuar no mesmo padrão.

4. Finalize com uma mensagem motivadora e realista.

FORMATO DA RESPOSTA:
- Use títulos claros.
- Use listas quando necessário.
- Use exemplos práticos.
- Seja objetivo, mas humano.
- Máximo 500 palavras.`

export async function POST(request: NextRequest) {
  try {
    const { renda, gastosFixos, gastosVariaveis, dividas } = await request.json()

    const totalGastos = gastosFixos + gastosVariaveis
    const disponivelParaDividas = renda - totalGastos
    const valorMensalRecomendado = Math.max(disponivelParaDividas * 0.7, 0)
    const totalDividas = dividas.reduce((acc: number, d: any) => acc + d.valor, 0)
    const prazoEstimado = valorMensalRecomendado > 0 
      ? Math.ceil(totalDividas / valorMensalRecomendado) 
      : 999

    // Ordena dívidas por juros (avalanche) ou valor (bola de neve)
    const dividasOrdenadas = [...dividas].sort((a: any, b: any) => {
      // Se tem juros, usa avalanche (maior juros primeiro)
      if (a.juros && b.juros) {
        return b.juros - a.juros
      }
      // Senão, usa bola de neve (menor valor primeiro)
      return a.valor - b.valor
    })

    const strategy = dividas.some((d: any) => d.juros > 0) ? 'avalanche' : 'bola_neve'

    const listaDividas = dividasOrdenadas
      .map((d: any, i: number) => 
        `${i + 1}. ${d.descricao || d.tipo}: R$ ${d.valor.toFixed(2)} (parcela: R$ ${d.parcela.toFixed(2)}${d.juros ? `, juros: ${d.juros}%` : ''})`
      )
      .join('\n')

    const prompt = `${PROMPT_PLAN}

DADOS DO USUÁRIO:
Renda mensal: R$ ${renda.toFixed(2)}
Gastos fixos mensais: R$ ${gastosFixos.toFixed(2)}
Gastos variáveis mensais: R$ ${gastosVariaveis.toFixed(2)}
Disponível para dívidas: R$ ${disponivelParaDividas.toFixed(2)}
Dívidas (ordenadas por prioridade):
${listaDividas}

Total em dívidas: R$ ${totalDividas.toFixed(2)}
Valor mensal recomendado para dívidas: R$ ${valorMensalRecomendado.toFixed(2)}
Prazo estimado: ${prazoEstimado} meses

Gere o plano completo agora:`

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
        max_tokens: 1200
      })
    })

    if (!response.ok) {
      throw new Error('Erro ao chamar OpenAI API')
    }

    const data = await response.json()
    const planText = data.choices[0].message.content

    // Mapeia os campos corretos para o frontend
    const orderedDebtsFormatted = dividasOrdenadas.map((d: any) => ({
      debt_type: d.tipo,
      description: d.descricao || d.tipo,
      total_amount: d.valor,
      monthly_payment: d.parcela,
      interest_rate: d.juros || 0
    }))

    return NextResponse.json({
      planText,
      strategy,
      monthlyAmount: valorMensalRecomendado,
      estimatedMonths: prazoEstimado,
      orderedDebts: orderedDebtsFormatted
    })
  } catch (error: any) {
    console.error('Erro na API de plano:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar plano', details: error.message },
      { status: 500 }
    )
  }
}
