'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react'
import FinancialChart from '@/components/custom/charts/FinancialChart'
import ReportGenerator from '@/components/custom/reports/ReportGenerator'
import FeedbackForm from '@/components/custom/feedback/FeedbackForm'
import { getCurrentUser, getIncome, getExpenses, getDebts } from '@/lib/api'

export default function RelatoriosPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    renda: 0,
    gastosFixos: 0,
    gastosVariaveis: 0,
    totalDividas: 0,
    economia: 0
  })

  useEffect(() => {
    async function loadData() {
      try {
        const user = await getCurrentUser()
        if (!user) {
          router.push('/login')
          return
        }

        const [incomeData, expensesData, debtsData] = await Promise.all([
          getIncome(user.id),
          getExpenses(user.id),
          getDebts(user.id)
        ])

        const fixos = expensesData.filter((e: any) => e.type === 'fixed')
        const variaveis = expensesData.filter((e: any) => e.type === 'variable')
        
        const totalFixos = fixos.reduce((acc: number, e: any) => acc + e.amount, 0)
        const totalVariaveis = variaveis.reduce((acc: number, e: any) => acc + e.amount, 0)
        const totalDividas = debtsData.reduce((acc: number, d: any) => acc + d.total_amount, 0)

        setData({
          renda: incomeData?.amount || 0,
          gastosFixos: totalFixos,
          gastosVariaveis: totalVariaveis,
          totalDividas,
          economia: totalVariaveis * 0.2
        })

        setLoading(false)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        router.push('/dashboard')
      }
    }

    loadData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Carregando relatórios...</p>
      </div>
    )
  }

  const pieData = [
    { name: 'Gastos Fixos', value: data.gastosFixos },
    { name: 'Gastos Variáveis', value: data.gastosVariaveis },
    { name: 'Disponível', value: Math.max(0, data.renda - data.gastosFixos - data.gastosVariaveis) }
  ]

  const barData = [
    { name: 'Renda', value: data.renda },
    { name: 'Gastos', value: data.gastosFixos + data.gastosVariaveis },
    { name: 'Dívidas', value: data.totalDividas }
  ]

  const lineData = [
    { name: 'Jan', value: data.totalDividas },
    { name: 'Fev', value: data.totalDividas * 0.9 },
    { name: 'Mar', value: data.totalDividas * 0.8 },
    { name: 'Abr', value: data.totalDividas * 0.7 },
    { name: 'Mai', value: data.totalDividas * 0.6 },
    { name: 'Jun', value: data.totalDividas * 0.5 }
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Relatórios e Análises</h1>
              <p className="text-sm text-gray-600">Visualize seus dados financeiros em detalhes</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        {/* KPIs */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Renda Mensal</div>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(data.renda)}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-orange-100 p-3 rounded-xl">
                <TrendingDown className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Gastos</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(data.gastosFixos + data.gastosVariaveis)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-100 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Dívidas</div>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(data.totalDividas)}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Economia Potencial</div>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(data.economia)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Distribuição de Gastos</h3>
            <FinancialChart type="pie" data={pieData} />
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Comparativo Financeiro</h3>
            <FinancialChart type="bar" data={barData} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Projeção de Quitação de Dívidas</h3>
          <FinancialChart type="line" data={lineData} colors={['#10b981']} />
          <p className="text-sm text-gray-600 mt-4 text-center">
            Projeção baseada no pagamento mensal atual
          </p>
        </div>

        {/* Report Generator */}
        <ReportGenerator data={data} />

        {/* Feedback */}
        <FeedbackForm />
      </div>
    </div>
  )
}
