'use client'

import { useState, useEffect } from 'react'
import { Trophy, Target, Award, Star, Gift, Zap } from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: any
  progress: number
  total: number
  unlocked: boolean
  reward: string
}

export default function GamificationSystem() {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Primeiro Passo',
      description: 'Registre seu primeiro gasto',
      icon: Target,
      progress: 1,
      total: 1,
      unlocked: true,
      reward: '10 pontos'
    },
    {
      id: '2',
      title: 'Economista Iniciante',
      description: 'Economize R$ 100 em um mês',
      icon: Trophy,
      progress: 75,
      total: 100,
      unlocked: false,
      reward: '50 pontos'
    },
    {
      id: '3',
      title: 'Mestre das Metas',
      description: 'Complete 5 metas financeiras',
      icon: Award,
      progress: 3,
      total: 5,
      unlocked: false,
      reward: '100 pontos'
    },
    {
      id: '4',
      title: 'Sequência de Ouro',
      description: 'Registre gastos por 30 dias seguidos',
      icon: Star,
      progress: 15,
      total: 30,
      unlocked: false,
      reward: '200 pontos'
    },
    {
      id: '5',
      title: 'Super Poupador',
      description: 'Economize R$ 1.000 em um mês',
      icon: Zap,
      progress: 450,
      total: 1000,
      unlocked: false,
      reward: '500 pontos'
    },
  ])

  const [totalPoints, setTotalPoints] = useState(10)
  const [level, setLevel] = useState(1)
  const [levelProgress, setLevelProgress] = useState(10)

  return (
    <div className="space-y-6">
      {/* Nível e Pontos */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold">Nível {level}</h3>
            <p className="text-emerald-100">Economista Iniciante</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{totalPoints}</div>
            <p className="text-emerald-100 text-sm">pontos</p>
          </div>
        </div>
        <div className="bg-white/20 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `${levelProgress}%` }}
          />
        </div>
        <p className="text-sm text-emerald-100 mt-2">{levelProgress}% para o próximo nível</p>
      </div>

      {/* Conquistas */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-emerald-600" />
          Conquistas
        </h3>
        <div className="space-y-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon
            const progressPercent = (achievement.progress / achievement.total) * 100
            
            return (
              <div 
                key={achievement.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  achievement.unlocked 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    achievement.unlocked 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-gray-900">{achievement.title}</h4>
                      {achievement.unlocked && (
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                          Desbloqueado!
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                    {!achievement.unlocked && (
                      <>
                        <div className="bg-gray-200 rounded-full h-2 overflow-hidden mb-1">
                          <div 
                            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">
                            {achievement.progress} / {achievement.total}
                          </span>
                          <span className="text-emerald-600 font-semibold">
                            <Gift className="w-3 h-3 inline mr-1" />
                            {achievement.reward}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recompensas Disponíveis */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Gift className="w-6 h-6 text-emerald-600" />
          Recompensas Disponíveis
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-600 transition-colors cursor-pointer">
            <div className="text-2xl font-bold text-emerald-600 mb-1">100 pontos</div>
            <p className="text-sm text-gray-600">Tema Premium</p>
          </div>
          <div className="p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-600 transition-colors cursor-pointer">
            <div className="text-2xl font-bold text-emerald-600 mb-1">200 pontos</div>
            <p className="text-sm text-gray-600">Relatório Avançado</p>
          </div>
          <div className="p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-600 transition-colors cursor-pointer">
            <div className="text-2xl font-bold text-emerald-600 mb-1">500 pontos</div>
            <p className="text-sm text-gray-600">Consultoria Grátis</p>
          </div>
          <div className="p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-600 transition-colors cursor-pointer">
            <div className="text-2xl font-bold text-emerald-600 mb-1">1000 pontos</div>
            <p className="text-sm text-gray-600">1 Mês Premium</p>
          </div>
        </div>
      </div>
    </div>
  )
}
