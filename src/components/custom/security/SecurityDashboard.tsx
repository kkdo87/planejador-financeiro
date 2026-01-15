'use client'

import { useState } from 'react'
import { Shield, Lock, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react'

export default function SecurityDashboard() {
  const [showSensitiveData, setShowSensitiveData] = useState(false)

  const securityFeatures = [
    {
      title: 'Criptografia de Ponta a Ponta',
      description: 'Todos os seus dados são criptografados com AES-256',
      status: 'active',
      icon: Lock
    },
    {
      title: 'Autenticação de Dois Fatores',
      description: 'Camada extra de segurança para sua conta',
      status: 'active',
      icon: Shield
    },
    {
      title: 'Backup Automático',
      description: 'Seus dados são salvos automaticamente a cada hora',
      status: 'active',
      icon: CheckCircle
    },
    {
      title: 'Monitoramento de Atividades',
      description: 'Detectamos atividades suspeitas em tempo real',
      status: 'active',
      icon: Eye
    }
  ]

  return (
    <div className="space-y-6">
      {/* Status de Segurança */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Segurança Máxima</h3>
            <p className="text-emerald-100">Seus dados estão 100% protegidos</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="w-5 h-5" />
          <span>Última verificação: há 2 minutos</span>
        </div>
      </div>

      {/* Recursos de Segurança */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recursos de Segurança</h3>
        <div className="space-y-4">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <Icon className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-gray-900">{feature.title}</h4>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                      Ativo
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Privacidade de Dados */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Privacidade de Dados</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Mostrar dados sensíveis</h4>
              <p className="text-sm text-gray-600">Exibir valores completos no dashboard</p>
            </div>
            <button
              onClick={() => setShowSensitiveData(!showSensitiveData)}
              className={`p-3 rounded-xl transition-colors ${
                showSensitiveData 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {showSensitiveData ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>

          <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-900 mb-1">Certificações de Segurança</h4>
                <p className="text-sm text-amber-800">
                  PoupApp é certificado com ISO 27001, SOC 2 Type II e está em conformidade com LGPD.
                  Seus dados financeiros são tratados com o mais alto nível de segurança.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Atividades Recentes */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Atividades Recentes</h3>
        <div className="space-y-3">
          {[
            { action: 'Login realizado', time: 'Há 2 horas', location: 'São Paulo, BR' },
            { action: 'Backup automático', time: 'Há 3 horas', location: 'Sistema' },
            { action: 'Senha alterada', time: 'Há 2 dias', location: 'São Paulo, BR' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900 text-sm">{activity.action}</p>
                <p className="text-xs text-gray-600">{activity.location}</p>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
