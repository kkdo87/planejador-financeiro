'use client'

import { useState } from 'react'
import { FileText, Download, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ReportData {
  renda: number
  gastosFixos: number
  gastosVariaveis: number
  totalDividas: number
  economia: number
}

export default function ReportGenerator({ data }: { data: ReportData }) {
  const [generating, setGenerating] = useState(false)

  const generatePDF = async () => {
    setGenerating(true)
    
    // Simular geração de PDF (em produção, usar biblioteca como jsPDF)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const reportContent = `
RELATÓRIO FINANCEIRO
Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RESUMO FINANCEIRO

Renda Mensal: R$ ${data.renda.toFixed(2)}
Gastos Fixos: R$ ${data.gastosFixos.toFixed(2)}
Gastos Variáveis: R$ ${data.gastosVariaveis.toFixed(2)}
Total de Dívidas: R$ ${data.totalDividas.toFixed(2)}
Economia Potencial: R$ ${data.economia.toFixed(2)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ANÁLISE

Total de Gastos: R$ ${(data.gastosFixos + data.gastosVariaveis).toFixed(2)}
Percentual da Renda: ${((data.gastosFixos + data.gastosVariaveis) / data.renda * 100).toFixed(1)}%
Sobra Mensal: R$ ${(data.renda - data.gastosFixos - data.gastosVariaveis).toFixed(2)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RECOMENDAÇÕES

1. Reduza gastos variáveis em 20%
2. Priorize pagamento de dívidas com juros altos
3. Crie uma reserva de emergência
4. Revise assinaturas e serviços não utilizados

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Este relatório foi gerado automaticamente pelo
Planejador Financeiro IA
    `
    
    // Criar blob e fazer download
    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-financeiro-${format(new Date(), 'yyyy-MM-dd')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    setGenerating(false)
  }

  const generateCSV = async () => {
    setGenerating(true)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const csvContent = `Categoria,Valor
Renda Mensal,${data.renda}
Gastos Fixos,${data.gastosFixos}
Gastos Variáveis,${data.gastosVariaveis}
Total de Dívidas,${data.totalDividas}
Economia Potencial,${data.economia}
Total de Gastos,${data.gastosFixos + data.gastosVariaveis}
Sobra Mensal,${data.renda - data.gastosFixos - data.gastosVariaveis}
`
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dados-financeiros-${format(new Date(), 'yyyy-MM-dd')}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    setGenerating(false)
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Relatórios</h3>
          <p className="text-sm text-gray-600">Exporte seus dados financeiros</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <button
          onClick={generatePDF}
          disabled={generating}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50"
        >
          {generating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          Baixar Relatório TXT
        </button>

        <button
          onClick={generateCSV}
          disabled={generating}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg disabled:opacity-50"
        >
          {generating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          Exportar CSV
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Os relatórios incluem todos os seus dados financeiros atuais
      </p>
    </div>
  )
}
