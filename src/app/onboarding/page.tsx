'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DollarSign, Home, Zap, ShoppingCart, CreditCard, TrendingUp, ArrowRight, ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { getCurrentUser, saveIncome, saveExpenses, saveDebts } from '@/lib/api'

type Step = 1 | 2 | 3 | 4

interface Expense {
  category: string
  amount: string
  type: 'fixed' | 'variable'
}

interface Debt {
  debt_type: string
  description: string
  total_amount: string
  monthly_payment: string
  interest_rate: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Step 1: Renda
  const [renda, setRenda] = useState('')

  // Step 2: Gastos Fixos
  const [gastosFixos, setGastosFixos] = useState<Expense[]>([
    { category: 'Aluguel', amount: '', type: 'fixed' },
    { category: 'Água', amount: '', type: 'fixed' },
    { category: 'Luz', amount: '', type: 'fixed' },
    { category: 'Internet', amount: '', type: 'fixed' },
  ])

  // Step 3: Gastos Variáveis
  const [gastosVariaveis, setGastosVariaveis] = useState<Expense[]>([
    { category: 'Mercado', amount: '', type: 'variable' },
    { category: 'Transporte', amount: '', type: 'variable' },
    { category: 'Lazer', amount: '', type: 'variable' },
    { category: 'Delivery', amount: '', type: 'variable' },
  ])

  // Step 4: Dívidas
  const [dividas, setDividas] = useState<Debt[]>([
    { debt_type: 'Cartão de Crédito', description: '', total_amount: '', monthly_payment: '', interest_rate: '' }
  ])

  useEffect(() => {
    async function checkAuth() {
      const user = await getCurrentUser()
      if (!user) {
        router.push('/login')
      } else {
        setUserId(user.id)
      }
    }
    checkAuth()
  }, [router])

  const addGastoFixo = () => {
    setGastosFixos([...gastosFixos, { category: '', amount: '', type: 'fixed' }])
  }

  const removeGastoFixo = (index: number) => {
    setGastosFixos(gastosFixos.filter((_, i) => i !== index))
  }

  const updateGastoFixo = (index: number, field: keyof Expense, value: string) => {
    const updated = [...gastosFixos]
    updated[index] = { ...updated[index], [field]: value }
    setGastosFixos(updated)
  }

  const addGastoVariavel = () => {
    setGastosVariaveis([...gastosVariaveis, { category: '', amount: '', type: 'variable' }])
  }

  const removeGastoVariavel = (index: number) => {
    setGastosVariaveis(gastosVariaveis.filter((_, i) => i !== index))
  }

  const updateGastoVariavel = (index: number, field: keyof Expense, value: string) => {
    const updated = [...gastosVariaveis]
    updated[index] = { ...updated[index], [field]: value }
    setGastosVariaveis(updated)
  }

  const addDivida = () => {
    setDividas([...dividas, { debt_type: 'Cartão de Crédito', description: '', total_amount: '', monthly_payment: '', interest_rate: '' }])
  }

  const removeDivida = (index: number) => {
    setDividas(dividas.filter((_, i) => i !== index))
  }

  const updateDivida = (index: number, field: keyof Debt, value: string) => {
    const updated = [...dividas]
    updated[index] = { ...updated[index], [field]: value }
    setDividas(updated)
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as Step)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step)
    }
  }

  const handleSubmit = async () => {
    if (!userId) return

    setLoading(true)
    try {
      // Salvar renda
      await saveIncome(userId, parseFloat(renda))

      // Salvar gastos fixos e variáveis
      const allExpenses = [
        ...gastosFixos.filter(g => g.amount).map(g => ({
          category: g.category,
          amount: parseFloat(g.amount),
          type: 'fixed' as const
        })),
        ...gastosVariaveis.filter(g => g.amount).map(g => ({
          category: g.category,
          amount: parseFloat(g.amount),
          type: 'variable' as const
        }))
      ]
      await saveExpenses(userId, allExpenses)

      // Salvar dívidas
      const validDebts = dividas.filter(d => d.total_amount).map(d => ({
        debt_type: d.debt_type,
        description: d.description || d.debt_type,
        total_amount: parseFloat(d.total_amount),
        monthly_payment: parseFloat(d.monthly_payment) || 0,
        interest_rate: d.interest_rate ? parseFloat(d.interest_rate) : undefined
      }))
      if (validDebts.length > 0) {
        await saveDebts(userId, validDebts)
      }

      // Redirecionar para diagnóstico
      router.push('/diagnostico')
    } catch (error) {
      console.error('Erro ao salvar dados:', error)
      alert('Erro ao salvar dados. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const progressPercentage = (currentStep / 4) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Passo {currentStep} de 4</span>
            <span className="text-sm font-medium text-gray-700">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step 1: Renda */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Qual sua renda mensal?</h2>
                <p className="text-gray-600">Considere todos os ganhos fixos que você recebe por mês</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Renda mensal (R$)
                </label>
                <input
                  type="number"
                  value={renda}
                  onChange={(e) => setRenda(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="3000"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 2: Gastos Fixos */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Gastos Fixos Mensais</h2>
                <p className="text-gray-600">Despesas que você paga todo mês no mesmo valor</p>
              </div>

              <div className="space-y-4">
                {gastosFixos.map((gasto, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={gasto.category}
                      onChange={(e) => updateGastoFixo(index, 'category', e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Categoria"
                    />
                    <input
                      type="number"
                      value={gasto.amount}
                      onChange={(e) => updateGastoFixo(index, 'amount', e.target.value)}
                      className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="R$"
                    />
                    {gastosFixos.length > 1 && (
                      <button
                        onClick={() => removeGastoFixo(index)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={addGastoFixo}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Adicionar outro gasto fixo
              </button>
            </div>
          )}

          {/* Step 3: Gastos Variáveis */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Gastos Variáveis Mensais</h2>
                <p className="text-gray-600">Despesas que variam de mês para mês</p>
              </div>

              <div className="space-y-4">
                {gastosVariaveis.map((gasto, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={gasto.category}
                      onChange={(e) => updateGastoVariavel(index, 'category', e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Categoria"
                    />
                    <input
                      type="number"
                      value={gasto.amount}
                      onChange={(e) => updateGastoVariavel(index, 'amount', e.target.value)}
                      className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="R$"
                    />
                    {gastosVariaveis.length > 1 && (
                      <button
                        onClick={() => removeGastoVariavel(index)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={addGastoVariavel}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Adicionar outro gasto variável
              </button>
            </div>
          )}

          {/* Step 4: Dívidas */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Suas Dívidas</h2>
                <p className="text-gray-600">Liste todas as dívidas que você possui atualmente</p>
              </div>

              <div className="space-y-6">
                {dividas.map((divida, index) => (
                  <div key={index} className="p-4 border-2 border-gray-200 rounded-lg space-y-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-700">Dívida {index + 1}</span>
                      {dividas.length > 1 && (
                        <button
                          onClick={() => removeDivida(index)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <select
                      value={divida.debt_type}
                      onChange={(e) => updateDivida(index, 'debt_type', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="Cartão de Crédito">Cartão de Crédito</option>
                      <option value="Empréstimo Pessoal">Empréstimo Pessoal</option>
                      <option value="Financiamento">Financiamento</option>
                      <option value="Cheque Especial">Cheque Especial</option>
                      <option value="Outro">Outro</option>
                    </select>

                    <input
                      type="text"
                      value={divida.description}
                      onChange={(e) => updateDivida(index, 'description', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Descrição (ex: Cartão Nubank)"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        value={divida.total_amount}
                        onChange={(e) => updateDivida(index, 'total_amount', e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Valor total (R$)"
                      />
                      <input
                        type="number"
                        value={divida.monthly_payment}
                        onChange={(e) => updateDivida(index, 'monthly_payment', e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Parcela mensal (R$)"
                      />
                    </div>

                    <input
                      type="number"
                      value={divida.interest_rate}
                      onChange={(e) => updateDivida(index, 'interest_rate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Taxa de juros (% ao mês) - opcional"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={addDivida}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-red-500 hover:text-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Adicionar outra dívida
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </button>
            )}

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                disabled={currentStep === 1 && !renda}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !renda}
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  'Gerando diagnóstico...'
                ) : (
                  <>
                    Gerar meu diagnóstico
                    <TrendingUp className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
