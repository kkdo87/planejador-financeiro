'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, TrendingUp, ArrowRight, Loader2, Calendar, DollarSign } from 'lucide-react'
import { getCurrentUser, getIncome, getExpenses, getDebts, savePlan, generatePlan } from '@/lib/api'

export default function PlanoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [planText, setPlanText] = useState('')
  const [strategy, setStrategy] = useState<'bola_neve' | 'avalanche'>('bola_neve')
  const [monthlyAmount, setMonthlyAmount] = useState(0)
  const [estimatedMonths, setEstimatedMonths] = useState(0)
  const [orderedDebts, setOrderedDebts] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const user = await getCurrentUser()
        if (!user) {
          router.push('/login')
          return
        }

        // Busca dados do Supabase
        const incomeData = await getIncome(user.id)
        const expensesData = await getExpenses(user.id)
        const debtsData = await getDebts(user.id)

        if (!incomeData || !debtsData || debtsData.length === 0) {
          router.push('/onboarding')
          return
        }

        const rendaMensal = incomeData.amount
        const fixos = expensesData
          .filter((e: any) => e.type === 'fixed')
          .reduce((acc: number, e: any) => acc + e.amount, 0)
        const variaveis = expensesData
          .filter((e: any) => e.type === 'variable')
          .reduce((acc: number, e: any) => acc + e.amount, 0)

        // Gera plano com IA
        const dividasFormatadas = debtsData.map((d: any) => ({
          tipo: d.debt_type,
          descricao: d.description,
          valor: d.total_amount,
          parcela: d.monthly_payment,
          juros: d.interest_rate || 0
        }))

        const plan = await generatePlan(rendaMensal, fixos, variaveis, dividasFormatadas)
        
        setPlanText(plan.planText)
        setStrategy(plan.strategy)
        setMonthlyAmount(plan.monthlyAmount)
        setEstimatedMonths(plan.estimatedMonths)
        setOrderedDebts(plan.orderedDebts)

        // Salva plano no banco
        await savePlan(user.id, plan.strategy, plan.monthlyAmount, plan.estimatedMonths, plan.planText)

        setLoading(false)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        alert('Erro ao carregar dados. Tente novamente.')
        router.push('/diagnostico')
      }
    }

    loadData()
  }, [router])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto" />
          <p className="text-xl text-gray-600">Criando seu plano personalizado...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Seu Plano de Saída das Dívidas</h1>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Resumo do Plano */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-sm text-gray-600 mb-1">Estratégia</div>
            <div className="text-lg font-bold text-gray-900">
              {strategy === 'bola_neve' ? 'Bola de Neve' : 'Avalanche'}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-sm text-gray-600 mb-1">Valor Mensal</div>
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(monthlyAmount)}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-sm text-gray-600 mb-1">Prazo Estimado</div>
            <div className="text-lg font-bold text-gray-900">
              {estimatedMonths} {estimatedMonths === 1 ? 'mês' : 'meses'}
            </div>
          </div>
        </div>

        {/* Ordem de Pagamento */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Ordem de Pagamento das Dívidas</h3>
          <div className="space-y-4">
            {orderedDebts.map((debt: any, index: number) => (
              <div key={index} className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-blue-600">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">
                    {debt.descricao || debt.debt_type}
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Valor total: <strong>{formatCurrency(debt.total_amount)}</strong></p>
                    <p>Parcela mensal: <strong>{formatCurrency(debt.monthly_payment)}</strong></p>
                    {debt.interest_rate > 0 && (
                      <p>Juros: <strong>{debt.interest_rate}% ao mês</strong></p>
                    )}
                  </div>
                </div>
                <CheckCircle className="w-6 h-6 text-gray-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Plano Detalhado da IA */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl flex-shrink-0">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Plano Completo Personalizado</h3>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {planText}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-2xl hover:shadow-blue-500/50 hover:scale-105 flex items-center gap-2 mx-auto"
          >
            Ir para o Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-sm text-gray-600">
            Acompanhe seu progresso e receba alertas inteligentes
          </p>
        </div>
      </div>
    </div>
  )
}
