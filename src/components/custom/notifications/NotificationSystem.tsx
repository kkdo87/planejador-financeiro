'use client'

import { useEffect, useState } from 'react'
import { Bell, X, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { format, addDays, isBefore } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Notification {
  id: string
  type: 'info' | 'warning' | 'success' | 'error'
  title: string
  message: string
  date: Date
  read: boolean
}

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showPanel, setShowPanel] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Carregar notificações do localStorage
    const stored = localStorage.getItem('notifications')
    if (stored) {
      const parsed = JSON.parse(stored)
      setNotifications(parsed.map((n: any) => ({ ...n, date: new Date(n.date) })))
    }

    // Gerar notificações automáticas baseadas em datas
    generateAutomaticNotifications()
  }, [])

  useEffect(() => {
    const count = notifications.filter(n => !n.read).length
    setUnreadCount(count)
  }, [notifications])

  const generateAutomaticNotifications = () => {
    const today = new Date()
    const newNotifications: Notification[] = []

    // Exemplo: Notificação de vencimento próximo
    const paymentDate = addDays(today, 3)
    newNotifications.push({
      id: `payment-${Date.now()}`,
      type: 'warning',
      title: 'Pagamento Próximo',
      message: `Você tem um pagamento vencendo em ${format(paymentDate, 'dd/MM/yyyy', { locale: ptBR })}`,
      date: today,
      read: false
    })

    // Exemplo: Lembrete de economia
    if (today.getDate() === 1) {
      newNotifications.push({
        id: `savings-${Date.now()}`,
        type: 'info',
        title: 'Novo Mês',
        message: 'Lembre-se de revisar seu orçamento e metas de economia para este mês!',
        date: today,
        read: false
      })
    }

    // Salvar no localStorage
    const existing = JSON.parse(localStorage.getItem('notifications') || '[]')
    const updated = [...existing, ...newNotifications]
    localStorage.setItem('notifications', JSON.stringify(updated))
    setNotifications(updated.map((n: any) => ({ ...n, date: new Date(n.date) })))
  }

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    )
    setNotifications(updated)
    localStorage.setItem('notifications', JSON.stringify(updated))
  }

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id)
    setNotifications(updated)
    localStorage.setItem('notifications', JSON.stringify(updated))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case 'error': return <AlertCircle className="w-5 h-5 text-red-600" />
      default: return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200'
      case 'warning': return 'bg-yellow-50 border-yellow-200'
      case 'error': return 'bg-red-50 border-red-200'
      default: return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {showPanel && (
        <div className="absolute right-0 top-12 w-96 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 z-50 max-h-[500px] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Notificações</h3>
            <button
              onClick={() => setShowPanel(false)}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-xl border-2 ${getBgColor(notification.type)} ${
                      !notification.read ? 'font-semibold' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-bold text-gray-900">{notification.title}</h4>
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 hover:bg-white/50 rounded"
                          >
                            <X className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {format(notification.date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </span>
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:underline"
                            >
                              Marcar como lida
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
