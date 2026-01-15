'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, TrendingUp, ArrowRight, Loader2 } from 'lucide-react'
import { getCurrentUser, getIncome, getExpenses, getDebts, saveDiagnosis, generateDiagnosis } from '@/lib/api'

export default function DiagnosticoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [renda, setRenda] = useState(0)
  const [gastosFixos, setGastosFixos] = useState(0)
  const [gastosVariaveis, setGastosVariaveis] = useState(0)
  const [dividas, setDividas] = useState<any[]>([])
  const [percentualComprometido, setPercentualComprometido] = useState(0)
  const [status, setStatus] = useState<'controlável' | 'risco' | 'crítico'>('controlável')
  const [diagnosisText, setDiagnosisText] = useState('')

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

        if (!incomeData) {
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

        setRenda(rendaMensal)
        setGastosFixos(fixos)
        setGastosVariaveis(variaveis)
        setDividas(debtsData)

        // Gera diagnóstico com IA
        const dividasFormatadas = debtsData.map((d: any) => ({
          tipo: d.debt_type,
          valor: d.total_amount,
          juros: d.interest_rate || 0
        }))

        const diagnosis = await generateDiagnosis(rendaMensal, fixos, variaveis, dividasFormatadas)
        
        setDiagnosisText(diagnosis.diagnosisText)
        setStatus(diagnosis.riskLevel)
        setPercentualComprometido(diagnosis.percentualComprometido)

        // Salva diagnóstico no banco
        await saveDiagnosis(user.id, diagnosis.diagnosisText, diagnosis.riskLevel)

        setLoading(false)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        alert('Erro ao carregar dados. Tente novamente.')
        router.push('/onboarding')
      }
    }

    loadData()
  }, [router])

  const getStatusConfig = () => {
    switch (status) {
      case 'controlável':
        return {
          bgColor: 'bg-emerald-100',
          textColor: 'text-emerald-700',
          borderColor: 'border-emerald-300',
          icon: '🟢',
          titulo: 'Situação Controlável'
        }
      case 'risco':
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-700',
          borderColor: 'border-yellow-300',
          icon: '🟡',
          titulo: 'Zona de Risco'
        }
      case 'crítico':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-700',
          borderColor: 'border-red-300',
          icon: '🔴',
          titulo: 'Situação Crítica'
        }
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 text-emerald-600 animate-spin mx-auto" />
          <p className="text-xl text-gray-600">Analisando sua situação financeira...</p>
        </div>
      </div>
    )
  }

  const statusConfig = getStatusConfig()
  const totalDividas = dividas.reduce((acc, d) => acc + d.total_amount, 0)
  const totalGastos = gastosFixos + gastosVariaveis

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Seu Raio-X Financeiro</h1>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Status Card */}
        <div className={`${statusConfig.bgColor} border-2 ${statusConfig.borderColor} rounded-3xl p-8 sm:p-12 mb-8 text-center`}>
          <div className="text-6xl mb-4">{statusConfig.icon}</div>
          <h2 className={`text-3xl sm:text-4xl font-bold ${statusConfig.textColor} mb-2`}>
            {statusConfig.titulo}
          </h2>
          <p className={`text-lg ${statusConfig.textColor}`}>
            {percentualComprometido}% da sua renda está comprometida
          </p>
        </div>

        {/* Métricas */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="text-sm text-gray-600 mb-2">Renda Mensal</div>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(renda)}</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="text-sm text-gray-600 mb-2">Total de Gastos</div>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(totalGastos)}</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="text-sm text-gray-600 mb-2">Total em Dívidas</div>
            <div className="text-3xl font-bold text-red-600">{formatCurrency(totalDividas)}</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="text-sm text-gray-600 mb-2">Renda Comprometida</div>
            <div className={`text-3xl font-bold ${statusConfig.textColor}`}>
              {percentualComprometido}%
            </div>
          </div>
        </div>

        {/* Diagnóstico da IA */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-2xl flex-shrink-0">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Diagnóstico Personalizado</h3>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {diagnosisText}
              </div>
            </div>
          </div>
        </div>

        {/* Alerta se crítico */}
        {status === 'crítico' && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-red-900 mb-2">Atenção urgente necessária</h4>
              <p className="text-red-700">
                Sua situação exige ação imediata. Vamos criar um plano para você sair dessa situação o mais rápido possível.
              </p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => router.push('/plano')}
            className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 flex items-center gap-2 mx-auto"
          >
            Ver plano para sair das dívidas
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}
