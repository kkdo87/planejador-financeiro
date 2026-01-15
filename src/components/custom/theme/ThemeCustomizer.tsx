'use client'

import { useState } from 'react'
import { Palette, Sun, Moon, Sparkles } from 'lucide-react'

export default function ThemeCustomizer() {
  const [selectedTheme, setSelectedTheme] = useState('emerald')
  
  const themes = [
    { id: 'emerald', name: 'Esmeralda', primary: 'from-emerald-600 to-teal-600', color: 'bg-emerald-600' },
    { id: 'blue', name: 'Oceano', primary: 'from-blue-600 to-cyan-600', color: 'bg-blue-600' },
    { id: 'purple', name: 'Roxo Real', primary: 'from-purple-600 to-pink-600', color: 'bg-purple-600' },
    { id: 'orange', name: 'Pôr do Sol', primary: 'from-orange-600 to-red-600', color: 'bg-orange-600' },
    { id: 'green', name: 'Floresta', primary: 'from-green-600 to-emerald-600', color: 'bg-green-600' },
    { id: 'indigo', name: 'Noite', primary: 'from-indigo-600 to-purple-600', color: 'bg-indigo-600' },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Palette className="w-6 h-6 text-emerald-600" />
          Personalizar Tema
        </h3>
        
        {/* Seleção de Cores */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Escolha sua cor principal
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedTheme === theme.id
                    ? 'border-gray-900 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-full h-12 rounded-lg ${theme.color} mb-2`} />
                <p className="text-sm font-semibold text-gray-900">{theme.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Modo Claro/Escuro */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Modo de exibição
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 rounded-xl border-2 border-gray-900 bg-white">
              <Sun className="w-8 h-8 text-gray-900 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-900">Claro</p>
            </button>
            <button className="p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300">
              <Moon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">Escuro</p>
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <p className="text-sm font-semibold text-gray-700">Preview do Tema</p>
          </div>
          <div className={`bg-gradient-to-r ${themes.find(t => t.id === selectedTheme)?.primary} rounded-xl p-6 text-white`}>
            <h4 className="text-2xl font-bold mb-2">PoupApp</h4>
            <p className="text-white/90 mb-4">Seu assistente de economia personalizado</p>
            <button className="px-6 py-2 bg-white text-gray-900 rounded-lg font-semibold">
              Botão de Exemplo
            </button>
          </div>
        </div>

        {/* Botão Salvar */}
        <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg">
          Salvar Personalização
        </button>
      </div>
    </div>
  )
}
