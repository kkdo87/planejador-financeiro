'use client'

import { useState } from 'react'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'support'
  timestamp: Date
}

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Como posso ajudar você hoje?',
      sender: 'support',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [sending, setSending] = useState(false)

  const sendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setSending(true)

    // Simular resposta automática
    await new Promise(resolve => setTimeout(resolve, 1500))

    const autoResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: getAutoResponse(inputText),
      sender: 'support',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, autoResponse])
    setSending(false)
  }

  const getAutoResponse = (userText: string): string => {
    const lowerText = userText.toLowerCase()

    if (lowerText.includes('dívida') || lowerText.includes('divida')) {
      return 'Para gerenciar suas dívidas, acesse a seção "Plano" no menu. Lá você encontrará estratégias personalizadas para quitar suas dívidas mais rapidamente.'
    }

    if (lowerText.includes('gasto') || lowerText.includes('economia')) {
      return 'Na página "Gastos", você pode adicionar e categorizar todos os seus gastos. O sistema oferece sugestões automáticas de onde economizar!'
    }

    if (lowerText.includes('relatório') || lowerText.includes('relatorio')) {
      return 'Você pode gerar relatórios completos na seção "Dashboard". Basta clicar em "Relatórios" e escolher o formato de exportação (TXT ou CSV).'
    }

    if (lowerText.includes('notificação') || lowerText.includes('notificacao') || lowerText.includes('alerta')) {
      return 'As notificações aparecem no ícone de sino no topo da página. Você receberá alertas sobre vencimentos, metas e dicas financeiras.'
    }

    return 'Obrigado pela sua mensagem! Nossa equipe de suporte entrará em contato em breve. Enquanto isso, explore as funcionalidades do app no menu principal.'
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 z-50 flex flex-col max-h-[600px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">Suporte</h3>
                <p className="text-xs text-white/80">Online agora</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white border-2 border-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="bg-white border-2 border-gray-200 p-3 rounded-2xl">
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t-2 border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                disabled={sending}
              />
              <button
                onClick={sendMessage}
                disabled={sending || !inputText.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
