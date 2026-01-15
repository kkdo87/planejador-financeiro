import Link from 'next/link'
import { TrendingUp, CheckCircle, ArrowRight, Shield, Zap, Target, Users, Award, Star, MessageCircle, Lock, Smartphone, BarChart3, Bell, Gift } from 'lucide-react'
import Image from 'next/image'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-emerald-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">PoupApp</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="px-5 py-2.5 text-gray-700 hover:text-emerald-600 font-semibold transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/signup"
                className="px-7 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-emerald-500/50 hover:scale-105"
              >
                Começar Grátis
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Melhorado */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Award className="w-4 h-4" />
              #1 App de Economia Inteligente
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Economize mais com{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Inteligência Artificial
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed">
              Descubra onde seu dinheiro está indo e receba um plano personalizado para economizar até <span className="font-bold text-emerald-600">40% mais</span> todos os meses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href="/signup"
                className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-lg font-bold rounded-2xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 flex items-center justify-center gap-2"
              >
                Começar Agora - É Grátis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#demo"
                className="px-8 py-4 bg-white text-gray-900 text-lg font-bold rounded-2xl hover:bg-gray-50 transition-all shadow-xl border-2 border-gray-200 flex items-center justify-center gap-2"
              >
                Ver Demonstração
              </Link>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Configuração em 2 minutos</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-transform">
              <div className="bg-white rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Economia Mensal</span>
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900">R$ 1.247,00</div>
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                  <ArrowRight className="w-4 h-4" />
                  +32% vs mês anterior
                </div>
                <div className="h-32 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl flex items-end justify-around p-4">
                  <div className="w-12 bg-emerald-500 rounded-t-lg" style={{height: '40%'}}></div>
                  <div className="w-12 bg-emerald-500 rounded-t-lg" style={{height: '60%'}}></div>
                  <div className="w-12 bg-emerald-500 rounded-t-lg" style={{height: '80%'}}></div>
                  <div className="w-12 bg-emerald-600 rounded-t-lg" style={{height: '100%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prova Social */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
          <div className="grid sm:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">50k+</div>
              <div className="text-gray-600">Usuários Ativos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">R$ 45M</div>
              <div className="text-gray-600">Economizados</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">4.9/5</div>
              <div className="text-gray-600 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                Avaliação
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">98%</div>
              <div className="text-gray-600">Satisfação</div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona - Melhorado */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Como funciona em 3 passos simples
          </h2>
          <p className="text-xl text-gray-600">Comece a economizar em menos de 5 minutos</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <span className="text-3xl font-bold text-white">1</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Conecte suas contas</h3>
            <p className="text-gray-600 mb-4">
              Sincronize suas contas bancárias de forma segura. Seus dados são criptografados e protegidos.
            </p>
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
              <Lock className="w-4 h-4" />
              Segurança bancária
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <span className="text-3xl font-bold text-white">2</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">IA analisa seus gastos</h3>
            <p className="text-gray-600 mb-4">
              Nossa inteligência artificial identifica padrões e oportunidades de economia personalizadas.
            </p>
            <div className="flex items-center gap-2 text-teal-600 text-sm font-semibold">
              <Zap className="w-4 h-4" />
              Análise em tempo real
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <span className="text-3xl font-bold text-white">3</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Economize automaticamente</h3>
            <p className="text-gray-600 mb-4">
              Receba alertas inteligentes e dicas personalizadas para economizar mais todos os dias.
            </p>
            <div className="flex items-center gap-2 text-cyan-600 text-sm font-semibold">
              <Bell className="w-4 h-4" />
              Notificações inteligentes
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades Premium */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Recursos que fazem a diferença
          </h2>
          <p className="text-xl text-gray-600">Tudo que você precisa para controlar suas finanças</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: BarChart3, title: 'Análise Inteligente', desc: 'Gráficos e relatórios detalhados dos seus gastos' },
            { icon: Target, title: 'Metas Personalizadas', desc: 'Defina objetivos e acompanhe seu progresso' },
            { icon: Bell, title: 'Alertas Inteligentes', desc: 'Notificações quando você está gastando demais' },
            { icon: Lock, title: 'Segurança Total', desc: 'Criptografia de nível bancário para seus dados' },
            { icon: Smartphone, title: 'App Mobile', desc: 'Acesse de qualquer lugar, a qualquer momento' },
            { icon: Gift, title: 'Gamificação', desc: 'Ganhe conquistas e recompensas ao economizar' },
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-emerald-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Depoimentos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            O que nossos usuários dizem
          </h2>
          <p className="text-xl text-gray-600">Milhares de pessoas já transformaram suas finanças</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: 'Maria Silva', role: 'Professora', text: 'Economizei R$ 800 no primeiro mês! O PoupApp me mostrou gastos que eu nem sabia que tinha.', rating: 5 },
            { name: 'João Santos', role: 'Desenvolvedor', text: 'Finalmente consegui juntar dinheiro para minha viagem. O app é intuitivo e as dicas são ótimas!', rating: 5 },
            { name: 'Ana Costa', role: 'Empresária', text: 'Melhor decisão que tomei. Agora tenho controle total das minhas finanças e estou investindo mais.', rating: 5 },
          ].map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.name[0]}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Demonstração Interativa */}
      <section id="demo" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-12 text-white">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Veja o PoupApp em ação
            </h2>
            <p className="text-xl text-emerald-100">Demonstração interativa do nosso dashboard</p>
          </div>
          <div className="bg-white rounded-2xl p-8 text-gray-900">
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <p className="text-xl font-semibold text-gray-700">Demonstração Interativa</p>
                <p className="text-gray-600 mt-2">Vídeo ou tour guiado do produto</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planos e Preços */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Escolha seu plano
          </h2>
          <p className="text-xl text-gray-600">Comece grátis, faça upgrade quando quiser</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Plano Grátis */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Grátis</h3>
            <div className="text-4xl font-bold text-gray-900 mb-6">R$ 0<span className="text-lg text-gray-600">/mês</span></div>
            <ul className="space-y-4 mb-8">
              {['Análise básica de gastos', 'Até 3 contas conectadas', 'Relatórios mensais', 'Suporte por email'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/signup" className="block w-full py-3 bg-gray-100 text-gray-900 text-center font-bold rounded-xl hover:bg-gray-200 transition-colors">
              Começar Grátis
            </Link>
          </div>

          {/* Plano Pro */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-8 shadow-2xl transform scale-105 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
              MAIS POPULAR
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
            <div className="text-4xl font-bold text-white mb-6">R$ 19,90<span className="text-lg text-emerald-100">/mês</span></div>
            <ul className="space-y-4 mb-8">
              {['Tudo do plano Grátis', 'Contas ilimitadas', 'IA avançada de economia', 'Alertas inteligentes', 'Metas personalizadas', 'Suporte prioritário'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                  <span className="text-white">{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/signup" className="block w-full py-3 bg-white text-emerald-600 text-center font-bold rounded-xl hover:bg-gray-100 transition-colors">
              Começar Teste Grátis
            </Link>
          </div>

          {/* Plano Premium */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
            <div className="text-4xl font-bold text-gray-900 mb-6">R$ 39,90<span className="text-lg text-gray-600">/mês</span></div>
            <ul className="space-y-4 mb-8">
              {['Tudo do plano Pro', 'Consultoria financeira', 'Análise de investimentos', 'Planejamento tributário', 'Suporte 24/7', 'Acesso antecipado'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/signup" className="block w-full py-3 bg-gray-100 text-gray-900 text-center font-bold rounded-xl hover:bg-gray-200 transition-colors">
              Começar Teste Grátis
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-12 text-white shadow-2xl">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Pronto para economizar mais?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Junte-se a mais de 50.000 pessoas que já transformaram suas finanças
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-emerald-600 text-xl font-bold rounded-2xl hover:bg-gray-100 transition-all shadow-2xl hover:scale-105"
          >
            Começar Agora - É Grátis
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="text-sm text-emerald-100 mt-4">Sem cartão de crédito • Cancele quando quiser</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">PoupApp</span>
              </div>
              <p className="text-gray-400 text-sm">
                Seu assistente inteligente de economia e controle financeiro.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Funcionalidades</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Preços</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Segurança</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Sobre</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Carreiras</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Central de Ajuda</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contato</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 PoupApp. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
