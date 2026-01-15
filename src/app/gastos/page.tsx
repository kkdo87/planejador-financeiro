'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, TrendingDown, Loader2, ArrowLeft, Save } from 'lucide-react'
import { getCurrentUser, getIncome, getExpenses, saveExpense, deleteExpense } from '@/lib/api'
import toast from 'react-hot-toast'

interface Expense {
  id?: string
  category: string
  amount: number
  type: 'fixed' | 'variable'
}

export default function GastosPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [renda, setRenda] = useState(0)
  const [gastosFixos, setGastosFixos] = useState<Expense[]>([])
  const [gastosVariaveis, setGastosVariaveis] = useState<Expense[]>([])
  const [userId, setUserId] = useState<string>('')

  // Novo gasto
  const [novoGasto, setNovoGasto] = useState<Expense>({
    category: '',
    amount: 0,
    type: 'fixed'
  })

  useEffect(() => {
    async function loadData() {
      try {
        const user = await getCurrentUser()
        if (!user) {
          router.push('/login')
          return
        }

        setUserId(user.id)

        const incomeData = await getIncome(user.id)
        const expensesData = await getExpenses(user.id)

        if (incomeData) {
          setRenda(incomeData.amount)
        }

        const fixos = expensesData.filter((e: any) => e.type === 'fixed')
        const variaveis = expensesData.filter((e: any) => e.type === 'variable')

        setGastosFixos(fixos.map((e: any) => ({
          id: e.id,
          category: e.category,
          amount: e.amount,
          type: 'fixed'
        })))

        setGastosVariaveis(variaveis.map((e: any) => ({
          id: e.id,
          category: e.category,
          amount: e.amount,
          type: 'variable'
        })))

        setLoading(false)
        toast.success('Dados carregados com sucesso!')
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        toast.error('Erro ao carregar dados. Tente novamente.')
        router.push('/onboarding')
      }
    }

    loadData()
  }, [router])

  const handleAddGasto = async () => {
    if (!novoGasto.category || novoGasto.amount <= 0) {
      toast.error('Preencha todos os campos corretamente')
      return
    }

    setSaving(true)
    try {
      await saveExpense(userId, novoGasto.category, novoGasto.amount, novoGasto.type)

      if (novoGasto.type === 'fixed') {
        setGastosFixos([...gastosFixos, novoGasto])
      } else {
        setGastosVariaveis([...gastosVariaveis, novoGasto])
      }

      setNovoGasto({ category: '', amount: 0, type: 'fixed' })
      toast.success('Gasto adicionado com sucesso! 🎉')
    } catch (error) {
      console.error('Erro ao adicionar gasto:', error)
      toast.error('Erro ao adicionar gasto. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteGasto = async (id: string, type: 'fixed' | 'variable') => {
    if (!confirm('Deseja realmente excluir este gasto?')) return

    try {
      await deleteExpense(id)

      if (type === 'fixed') {
        setGastosFixos(gastosFixos.filter(g => g.id !== id))
      } else {
        setGastosVariaveis(gastosVariaveis.filter(g => g.id !== id))
      }

      toast.success('Gasto excluído com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir gasto:', error)
      toast.error('Erro ao excluir gasto. Tente novamente.')
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const totalFixos = gastosFixos.reduce((acc, g) => acc + g.amount, 0)
  const totalVariaveis = gastosVariaveis.reduce((acc, g) => acc + g.amount, 0)
  const totalGastos = totalFixos + totalVariaveis
  const percentualGasto = renda > 0 ? ((totalGastos / renda) * 100).toFixed(1) : 0
  const sobra = renda - totalGastos

  // Sugestões de economia
  const sugestoes = [
    {
      categoria: 'Gastos Variáveis',
      economia: totalVariaveis * 0.2,
      dica: 'Reduza 20% dos gastos variáveis (lazer, delivery, compras não essenciais)'
    },
    {
      categoria: 'Assinaturas',
      economia: gastosFixos.filter(g => g.category.toLowerCase().includes('assinatura')).reduce((acc, g) => acc + g.amount, 0) * 0.5,
      dica: 'Cancele assinaturas que você não usa frequentemente'
    },
    {
      categoria: 'Alimentação Fora',
      economia: gastosVariaveis.filter(g => g.category.toLowerCase().includes('alimentação') || g.category.toLowerCase().includes('restaurante')).reduce((acc, g) => acc + g.amount, 0) * 0.3,
      dica: 'Cozinhe mais em casa e reduza pedidos de delivery'
    }
  ].filter(s => s.economia > 0)

  const economiaTotal = sugestoes.reduce((acc, s) => acc + s.economia, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 text-orange-600 animate-spin mx-auto" />
          <p className="text-xl text-gray-600">Carregando seus gastos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Meus Gastos e Economia</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Resumo Financeiro */}
        <div className="grid sm:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="text-sm text-gray-600 mb-2">Renda Mensal</div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(renda)}</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="text-sm text-gray-600 mb-2">Total de Gastos</div>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(totalGastos)}</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="text-sm text-gray-600 mb-2">% da Renda Gasta</div>
            <div className="text-2xl font-bold text-red-600">{percentualGasto}%</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="text-sm text-gray-600 mb-2">Sobra no Mês</div>
            <div className={`text-2xl font-bold ${sobra >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(sobra)}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Gastos Fixos */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Gastos Fixos ({formatCurrency(totalFixos)})
            </h2>
            <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
              {gastosFixos.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhum gasto fixo cadastrado</p>
              ) : (
                gastosFixos.map((gasto, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-orange-300 transition-colors">
                    <div>
                      <div className="font-semibold text-gray-900">{gasto.category}</div>
                      <div className="text-sm text-gray-600">{formatCurrency(gasto.amount)}</div>
                    </div>
                    {gasto.id && (
                      <button
                        onClick={() => handleDeleteGasto(gasto.id!, 'fixed')}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Gastos Variáveis */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Gastos Variáveis ({formatCurrency(totalVariaveis)})
            </h2>
            <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
              {gastosVariaveis.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhum gasto variável cadastrado</p>
              ) : (
                gastosVariaveis.map((gasto, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-orange-300 transition-colors">
                    <div>
                      <div className="font-semibold text-gray-900">{gasto.category}</div>
                      <div className="text-sm text-gray-600">{formatCurrency(gasto.amount)}</div>
                    </div>
                    {gasto.id && (
                      <button
                        onClick={() => handleDeleteGasto(gasto.id!, 'variable')}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Adicionar Novo Gasto */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl p-8 shadow-2xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Adicionar Novo Gasto</h2>
          <div className="grid sm:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Categoria (ex: Aluguel)"
              value={novoGasto.category}
              onChange={(e) => setNovoGasto({ ...novoGasto, category: e.target.value })}
              className="px-4 py-3 rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:border-white"
            />
            <input
              type="number"
              placeholder="Valor"
              value={novoGasto.amount || ''}
              onChange={(e) => setNovoGasto({ ...novoGasto, amount: parseFloat(e.target.value) || 0 })}
              className="px-4 py-3 rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:border-white"
            />
            <select
              value={novoGasto.type}
              onChange={(e) => setNovoGasto({ ...novoGasto, type: e.target.value as 'fixed' | 'variable' })}
              className="px-4 py-3 rounded-xl border-2 border-white/20 bg-white/10 text-white focus:outline-none focus:border-white"
            >
              <option value="fixed" className="text-gray-900">Fixo</option>
              <option value="variable" className="text-gray-900">Variável</option>
            </select>
            <button
              onClick={handleAddGasto}
              disabled={saving}
              className="px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Adicionar
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sugestões de Economia */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-2xl flex-shrink-0">
              <TrendingDown className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Onde Você Pode Economizar</h3>
              <p className="text-gray-600 mb-6">
                Economia potencial total: <strong className="text-green-600">{formatCurrency(economiaTotal)}/mês</strong>
              </p>

              {sugestoes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Adicione seus gastos para receber sugestões personalizadas de economia</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sugestoes.map((sugestao, index) => (
                    <div key={index} className="p-6 border-2 border-green-200 rounded-2xl bg-green-50">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-bold text-gray-900">{sugestao.categoria}</h4>
                        <div className="text-xl font-bold text-green-600">
                          {formatCurrency(sugestao.economia)}
                        </div>
                      </div>
                      <p className="text-gray-700">{sugestao.dica}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
