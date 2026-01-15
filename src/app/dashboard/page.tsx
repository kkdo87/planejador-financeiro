'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  ShoppingCart, 
  CreditCard, 
  PiggyBank, 
  TrendingUp,
  Menu,
  X,
  AlertCircle,
  BarChart3,
  Calculator,
  FileText,
  Trophy,
  Palette,
  Shield
} from 'lucide-react';
import NotificationSystem from '@/components/custom/notifications/NotificationSystem';
import SupportChat from '@/components/custom/support/SupportChat';
import GamificationSystem from '@/components/custom/gamification/GamificationSystem';
import ThemeCustomizer from '@/components/custom/theme/ThemeCustomizer';
import SecurityDashboard from '@/components/custom/security/SecurityDashboard';
import Link from 'next/link';

interface DadosFinanceiros {
  renda: number;
  gastosFixos: number;
  gastosVariaveis: number;
  dividas: Array<{
    nome: string;
    valor: number;
    juros: number;
  }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [dados, setDados] = useState<DadosFinanceiros | null>(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState<'orcamento' | 'alertas' | 'simulador' | 'acompanhamento' | 'conquistas' | 'personalizacao' | 'seguranca'>('orcamento');

  useEffect(() => {
    const dadosStr = localStorage.getItem('dadosFinanceiros');
    if (!dadosStr) {
      router.push('/onboarding');
      return;
    }

    setDados(JSON.parse(dadosStr));
  }, [router]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (!dados) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p>Carregando...</p>
    </div>;
  }

  const totalDividas = dados.dividas.reduce((acc, d) => acc + d.valor, 0);
  const totalGastos = dados.gastosFixos + dados.gastosVariaveis;
  const disponivelParaDividas = dados.renda - totalGastos;
  const reservaSugerida = dados.renda * 0.1;

  const menuItems = [
    { id: 'orcamento', label: 'Orçamento', icon: BarChart3 },
    { id: 'alertas', label: 'Alertas', icon: AlertCircle },
    { id: 'simulador', label: 'Simulador', icon: Calculator },
    { id: 'acompanhamento', label: 'Progresso', icon: TrendingUp },
    { id: 'conquistas', label: 'Conquistas', icon: Trophy },
    { id: 'personalizacao', label: 'Tema', icon: Palette },
    { id: 'seguranca', label: 'Segurança', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">PoupApp</h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Notification System */}
              <NotificationSystem />

              {/* Quick Links */}
              <Link
                href="/relatorios"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <FileText className="w-5 h-5" />
                <span>Relatórios</span>
              </Link>

              <Link
                href="/gastos"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Gastos</span>
              </Link>
            </div>

            {/* Menu Desktop */}
            <nav className="hidden lg:flex items-center gap-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setPaginaAtual(item.id as any)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
                      paginaAtual === item.id
                        ? 'bg-emerald-100 text-emerald-700 font-bold'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Menu Mobile */}
            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl"
            >
              {menuAberto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Menu Mobile Dropdown */}
          {menuAberto && (
            <nav className="lg:hidden mt-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setPaginaAtual(item.id as any);
                      setMenuAberto(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                      paginaAtual === item.id
                        ? 'bg-emerald-100 text-emerald-700 font-bold'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <Link
                href="/relatorios"
                className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100"
              >
                <FileText className="w-5 h-5" />
                <span>Relatórios</span>
              </Link>
              <Link
                href="/gastos"
                className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Gastos</span>
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Orçamento Mensal */}
        {paginaAtual === 'orcamento' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Orçamento Mensal</h2>
              <p className="text-gray-600">Esse é o máximo seguro para gastar este mês</p>
            </div>

            {/* Cards de Orçamento */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Essenciais */}
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Home className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Essenciais</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(dados.gastosFixos)}
                    </div>
                  </div>
                </div>
                <div className="bg-blue-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full"
                    style={{ width: `${(dados.gastosFixos / dados.renda) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {Math.round((dados.gastosFixos / dados.renda) * 100)}% da renda
                </p>
              </div>

              {/* Variáveis */}
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <ShoppingCart className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Variáveis</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(dados.gastosVariaveis)}
                    </div>
                  </div>
                </div>
                <div className="bg-purple-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-600 h-full"
                    style={{ width: `${(dados.gastosVariaveis / dados.renda) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {Math.round((dados.gastosVariaveis / dados.renda) * 100)}% da renda
                </p>
              </div>

              {/* Dívidas */}
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-red-100 p-3 rounded-xl">
                    <CreditCard className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Dívidas</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(disponivelParaDividas * 0.7)}
                    </div>
                  </div>
                </div>
                <div className="bg-red-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-red-600 h-full"
                    style={{ width: `${((disponivelParaDividas * 0.7) / dados.renda) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Recomendado para pagamento
                </p>
              </div>

              {/* Reserva */}
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-emerald-100 p-3 rounded-xl">
                    <PiggyBank className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Reserva</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(reservaSugerida)}
                    </div>
                  </div>
                </div>
                <div className="bg-emerald-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full"
                    style={{ width: `${(reservaSugerida / dados.renda) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Meta: 10% da renda
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-3 gap-4">
              <Link
                href="/gastos"
                className="bg-gradient-to-r from-orange-500 to-amber-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all"
              >
                <ShoppingCart className="w-8 h-8 mb-3" />
                <h3 className="font-bold text-lg mb-1">Gerenciar Gastos</h3>
                <p className="text-sm text-white/80">Adicione e categorize seus gastos</p>
              </Link>

              <Link
                href="/relatorios"
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all"
              >
                <FileText className="w-8 h-8 mb-3" />
                <h3 className="font-bold text-lg mb-1">Ver Relatórios</h3>
                <p className="text-sm text-white/80">Gráficos e análises detalhadas</p>
              </Link>

              <Link
                href="/plano"
                className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all"
              >
                <TrendingUp className="w-8 h-8 mb-3" />
                <h3 className="font-bold text-lg mb-1">Meu Plano</h3>
                <p className="text-sm text-white/80">Estratégia para quitar dívidas</p>
              </Link>
            </div>

            {/* Mensagem */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-2xl flex-shrink-0">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Dica importante</h3>
                  <p className="text-gray-700">
                    Esse é o máximo seguro para gastar este mês. Se conseguir gastar menos em variáveis, 
                    use a diferença para acelerar o pagamento das dívidas ou aumentar sua reserva.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alertas */}
        {paginaAtual === 'alertas' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Alertas Inteligentes</h2>
              <p className="text-gray-600">Fique atento a esses pontos</p>
            </div>

            <div className="space-y-4">
              {/* Alerta 1 */}
              {(dados.gastosVariaveis / dados.renda) > 0.3 && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-yellow-900 mb-2">Gastos variáveis altos</h4>
                    <p className="text-yellow-700 mb-3">
                      Você está gastando {Math.round((dados.gastosVariaveis / dados.renda) * 100)}% da sua renda com gastos variáveis. 
                      O ideal seria no máximo 30%.
                    </p>
                    <p className="text-sm text-yellow-600">
                      Tente reduzir delivery, lazer ou compras não essenciais.
                    </p>
                  </div>
                </div>
              )}

              {/* Alerta 2 */}
              {totalDividas > dados.renda * 3 && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-red-900 mb-2">Dívidas muito altas</h4>
                    <p className="text-red-700 mb-3">
                      Suas dívidas totalizam {formatCurrency(totalDividas)}, mais de 3x sua renda mensal. 
                      Isso pode levar anos para quitar.
                    </p>
                    <p className="text-sm text-red-600">
                      Considere renegociar com os credores ou buscar orientação profissional.
                    </p>
                  </div>
                </div>
              )}

              {/* Alerta 3 */}
              {disponivelParaDividas < 0 && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-red-900 mb-2">Situação crítica</h4>
                    <p className="text-red-700 mb-3">
                      Seus gastos estão maiores que sua renda. Você está entrando em mais dívidas todo mês.
                    </p>
                    <p className="text-sm text-red-600">
                      É urgente cortar gastos ou aumentar sua renda. Foque no essencial.
                    </p>
                  </div>
                </div>
              )}

              {/* Mensagem positiva se tudo ok */}
              {(dados.gastosVariaveis / dados.renda) <= 0.3 && totalDividas <= dados.renda * 3 && disponivelParaDividas > 0 && (
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 flex items-start gap-4">
                  <TrendingUp className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-emerald-900 mb-2">Você está no caminho certo!</h4>
                    <p className="text-emerald-700">
                      Seus gastos estão controlados e você tem margem para pagar as dívidas. 
                      Continue assim e logo estará livre!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Simulador */}
        {paginaAtual === 'simulador' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Simulador Financeiro</h2>
              <p className="text-gray-600">Teste cenários antes de tomar decisões</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">E se eu...</h3>
              
              <div className="space-y-6">
                {/* Simulação 1 */}
                <div className="p-6 border-2 border-gray-200 rounded-2xl">
                  <h4 className="font-bold text-gray-900 mb-3">Reduzir gastos variáveis em 20%</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700">
                      Economia mensal: <strong className="text-emerald-600">{formatCurrency(dados.gastosVariaveis * 0.2)}</strong>
                    </p>
                    <p className="text-gray-700">
                      Poderia pagar dívidas: <strong className="text-emerald-600">{Math.round((dados.gastosVariaveis * 0.2) / (disponivelParaDividas * 0.7) * 100)}% mais rápido</strong>
                    </p>
                    <p className="text-emerald-600 font-medium mt-4">
                      ✓ Decisão inteligente! Isso aceleraria muito sua saída das dívidas.
                    </p>
                  </div>
                </div>

                {/* Simulação 2 */}
                <div className="p-6 border-2 border-gray-200 rounded-2xl">
                  <h4 className="font-bold text-gray-900 mb-3">Fazer um empréstimo de R$ 5.000</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700">
                      Nova dívida total: <strong className="text-red-600">{formatCurrency(totalDividas + 5000)}</strong>
                    </p>
                    <p className="text-gray-700">
                      Prazo adicional: <strong className="text-red-600">+{Math.ceil(5000 / (disponivelParaDividas * 0.7))} meses</strong>
                    </p>
                    <p className="text-red-600 font-medium mt-4">
                      ✗ Cuidado! Isso atrasaria sua saída das dívidas. Só faça se for extremamente necessário.
                    </p>
                  </div>
                </div>

                {/* Simulação 3 */}
                <div className="p-6 border-2 border-gray-200 rounded-2xl">
                  <h4 className="font-bold text-gray-900 mb-3">Aumentar renda em R$ 500/mês</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700">
                      Nova renda: <strong className="text-emerald-600">{formatCurrency(dados.renda + 500)}</strong>
                    </p>
                    <p className="text-gray-700">
                      Poderia pagar dívidas: <strong className="text-emerald-600">{Math.round((500) / (disponivelParaDividas * 0.7) * 100)}% mais rápido</strong>
                    </p>
                    <p className="text-emerald-600 font-medium mt-4">
                      ✓ Excelente! Buscar renda extra é uma das melhores estratégias.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Acompanhamento */}
        {paginaAtual === 'acompanhamento' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Seu Progresso</h2>
              <p className="text-gray-600">Acompanhe sua evolução</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <div className="text-sm text-gray-600 mb-2">Dívida Total</div>
                <div className="text-3xl font-bold text-red-600 mb-4">
                  {formatCurrency(totalDividas)}
                </div>
                <div className="text-xs text-gray-500">
                  Meta: R$ 0,00
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <div className="text-sm text-gray-600 mb-2">Meses Restantes</div>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  {Math.ceil(totalDividas / (disponivelParaDividas * 0.7))}
                </div>
                <div className="text-xs text-gray-500">
                  Seguindo o plano
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <div className="text-sm text-gray-600 mb-2">Progresso</div>
                <div className="text-3xl font-bold text-emerald-600 mb-4">
                  0%
                </div>
                <div className="text-xs text-gray-500">
                  Você está começando!
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-2xl flex-shrink-0">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Continue firme!</h3>
                  <p className="text-gray-700">
                    Você está no início da sua jornada. Cada mês que passa, você estará mais perto da liberdade financeira. 
                    Não desista, você consegue!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conquistas */}
        {paginaAtual === 'conquistas' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Conquistas</h2>
              <p className="text-gray-600">Ganhe pontos e desbloqueie recompensas</p>
            </div>
            <GamificationSystem />
          </div>
        )}

        {/* Personalização */}
        {paginaAtual === 'personalizacao' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Personalização</h2>
              <p className="text-gray-600">Customize a aparência do seu PoupApp</p>
            </div>
            <ThemeCustomizer />
          </div>
        )}

        {/* Segurança */}
        {paginaAtual === 'seguranca' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Segurança e Privacidade</h2>
              <p className="text-gray-600">Seus dados estão protegidos</p>
            </div>
            <SecurityDashboard />
          </div>
        )}
      </div>

      {/* Support Chat */}
      <SupportChat />
    </div>
  );
}
