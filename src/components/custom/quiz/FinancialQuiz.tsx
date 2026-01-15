'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { quizSteps, getProfileAnalysis } from '@/lib/quiz-data';
import { ArrowRight, CheckCircle, TrendingUp, Shield, Target, Sparkles, Mail, Loader2, AlertCircle } from 'lucide-react';

// Toast notification component
function Toast({ message, type = 'success', onClose }: { message: string; type?: 'success' | 'error' | 'info'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-emerald-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <div 
      className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slide-in flex items-center gap-3`}
      role="alert"
      aria-live="polite"
    >
      {type === 'success' && <CheckCircle className="w-5 h-5" />}
      {type === 'error' && <AlertCircle className="w-5 h-5" />}
      <span>{message}</span>
    </div>
  );
}

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Ops! Algo deu errado
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Encontramos um problema inesperado. Por favor, recarregue a página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-full hover:shadow-lg transition-all"
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function FinancialQuiz() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [email, setEmail] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const step = quizSteps[currentStep];
  const progress = ((currentStep + 1) / quizSteps.length) * 100;

  // Validação de email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAnswer = (questionId: string, answerId: string) => {
    try {
      setAnswers({ ...answers, [questionId]: answerId });
      setToast({ message: 'Resposta salva com sucesso!', type: 'success' });
      nextStep();
    } catch (error) {
      setToast({ message: 'Erro ao salvar resposta. Tente novamente.', type: 'error' });
    }
  };

  const nextStep = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, quizSteps.length - 1));
      setIsAnimating(false);
    }, 300);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setToast({ message: 'Por favor, insira seu email.', type: 'error' });
      return;
    }

    if (!validateEmail(email)) {
      setToast({ message: 'Por favor, insira um email válido.', type: 'error' });
      return;
    }

    try {
      setIsLoading(true);
      // Salvar email de forma segura
      localStorage.setItem('quizEmail', email);
      setToast({ message: 'Email salvo com sucesso!', type: 'success' });
      setTimeout(() => {
        setIsLoading(false);
        nextStep();
      }, 500);
    } catch (error) {
      setIsLoading(false);
      setToast({ message: 'Erro ao salvar email. Tente novamente.', type: 'error' });
    }
  };

  const handleFinalCTA = () => {
    try {
      setIsLoading(true);
      // Salvar dados do quiz no localStorage de forma segura
      localStorage.setItem('quizCompleted', 'true');
      localStorage.setItem('quizEmail', email);
      localStorage.setItem('quizAnswers', JSON.stringify(answers));
      
      setToast({ message: 'Redirecionando para o dashboard...', type: 'success' });
      
      // Redirecionar para dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      setToast({ message: 'Erro ao processar. Tente novamente.', type: 'error' });
    }
  };

  useEffect(() => {
    if (step.type === 'loading') {
      setTimeout(() => {
        try {
          const analysis = getProfileAnalysis(answers);
          setProfile(analysis);
          setToast({ message: 'Análise concluída!', type: 'success' });
          nextStep();
        } catch (error) {
          setToast({ message: 'Erro ao analisar perfil. Tente novamente.', type: 'error' });
        }
      }, 3000);
    }
  }, [currentStep, step.type]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && currentStep > 0) {
        setCurrentStep((prev) => Math.max(0, prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStep]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Toast Notifications */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Progress Bar */}
        <div 
          className="fixed top-0 left-0 right-0 h-2 bg-gray-200 dark:bg-gray-700 z-50"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progresso do quiz: ${Math.round(progress)}%`}
        >
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="container mx-auto px-4 py-12 md:py-20">
          <div
            className={`max-w-3xl mx-auto transition-all duration-300 ${
              isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
            }`}
          >
            {/* Welcome Screen */}
            {step.type === 'welcome' && (
              <div className="text-center space-y-8 animate-fade-in">
                <div 
                  className="inline-block p-4 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full mb-6"
                  aria-hidden="true"
                >
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  {step.title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300">
                  {step.subtitle}
                </p>
                <button
                  onClick={nextStep}
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-lg font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300"
                  aria-label="Começar quiz financeiro"
                >
                  {step.cta}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </button>
                <div className="flex items-center justify-center gap-8 pt-8 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" aria-hidden="true" />
                    <span>Menos de 3 minutos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-500" aria-hidden="true" />
                    <span>100% seguro</span>
                  </div>
                </div>
              </div>
            )}

            {/* Question Screen */}
            {step.type === 'question' && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center space-y-4">
                  <span 
                    className="inline-block px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium"
                    aria-label={`Pergunta ${currentStep} de ${quizSteps.filter(s => s.type === 'question').length}`}
                  >
                    Pergunta {currentStep} de {quizSteps.filter(s => s.type === 'question').length}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    {step.question}
                  </h2>
                </div>
                <div className="grid gap-4 mt-8" role="radiogroup" aria-label="Opções de resposta">
                  {step.options?.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(step.question || '', option.id)}
                      className="group p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-left hover:border-emerald-500 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-emerald-300"
                      role="radio"
                      aria-checked="false"
                      aria-label={option.text}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-medium text-gray-900 dark:text-white">
                          {option.text}
                        </span>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" aria-hidden="true" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Education Screen */}
            {step.type === 'education' && (
              <div className="space-y-8 animate-fade-in">
                <div className="bg-gradient-to-br from-blue-500 to-emerald-500 p-8 md:p-12 rounded-3xl text-white shadow-2xl">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-white/20 rounded-full" aria-hidden="true">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-bold mb-4">Você sabia?</h3>
                      <p className="text-lg md:text-xl leading-relaxed opacity-95">
                        {step.content}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={nextStep}
                    className="mt-6 px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50"
                    aria-label="Continuar para próxima etapa"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {/* Email Capture */}
            {step.type === 'email' && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center space-y-4">
                  <div className="inline-block p-4 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full mb-4" aria-hidden="true">
                    <Mail className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    {step.title}
                  </h2>
                </div>
                <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto space-y-6">
                  <div className="relative">
                    <label htmlFor="email-input" className="sr-only">
                      Seu endereço de email
                    </label>
                    <input
                      id="email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      disabled={isLoading}
                      className="w-full px-6 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full text-lg focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-describedby="email-help"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-lg font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    aria-label={isLoading ? 'Processando...' : step.cta}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      step.cta
                    )}
                  </button>
                  <p id="email-help" className="text-center text-sm text-gray-500 dark:text-gray-400">
                    <Shield className="w-4 h-4 inline mr-1" aria-hidden="true" />
                    Seus dados estão seguros e protegidos
                  </p>
                </form>
              </div>
            )}

            {/* Loading Screen */}
            {step.type === 'loading' && (
              <div className="text-center space-y-8 animate-fade-in">
                <div className="inline-block p-6 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full animate-pulse" aria-hidden="true">
                  <Loader2 className="w-16 h-16 text-white animate-spin" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {step.content}
                </h2>
                <div className="max-w-md mx-auto space-y-3">
                  <div 
                    className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-label="Analisando perfil financeiro"
                    aria-valuenow={100}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 animate-loading-bar" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Analisando seu perfil financeiro...</p>
                </div>
              </div>
            )}

            {/* Results Screen */}
            {step.type === 'results' && profile && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center space-y-4">
                  <div className="inline-block p-4 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full mb-4" aria-hidden="true">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    {step.title}
                  </h2>
                </div>
                <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-xl border-2 border-emerald-200 dark:border-emerald-800">
                  <h3 className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">
                    {profile.title}
                  </h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    {profile.description}
                  </p>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Recomendações personalizadas:</h4>
                    <ul className="space-y-3" role="list">
                      {profile.tips.map((tip: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                          <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button
                  onClick={nextStep}
                  className="w-full px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-lg font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300"
                  aria-label="Ver benefícios do PoupApp"
                >
                  Ver benefícios do PoupApp
                </button>
              </div>
            )}

            {/* Benefits Screen */}
            {step.type === 'benefits' && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    {step.title}
                  </h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { icon: Target, title: 'Orçamento Inteligente', desc: 'Crie e gerencie seu orçamento de forma automática' },
                    { icon: TrendingUp, title: 'Monitoramento', desc: 'Acompanhe suas despesas em tempo real' },
                    { icon: Shield, title: 'Planejamento', desc: 'Planeje seu futuro financeiro com segurança' }
                  ].map((benefit, index) => (
                    <div key={index} className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                      <benefit.icon className="w-12 h-12 text-emerald-500 mb-4" aria-hidden="true" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {benefit.desc}
                      </p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={nextStep}
                  className="w-full px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-lg font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300"
                  aria-label="Continuar para oferta"
                >
                  Continuar
                </button>
              </div>
            )}

            {/* Final Offer */}
            {step.type === 'offer' && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center space-y-6">
                  <div className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-full text-lg animate-pulse">
                    🎉 OFERTA EXCLUSIVA
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                    {step.title}
                  </h2>
                  <p className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {step.subtitle}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-blue-500 p-8 md:p-12 rounded-3xl text-white shadow-2xl">
                  <div className="space-y-6">
                    <ul className="space-y-6" role="list">
                      {[
                        'Acesso completo a todas as ferramentas',
                        'Suporte prioritário 24/7',
                        'Relatórios personalizados ilimitados',
                        'Sem compromisso - cancele quando quiser'
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <CheckCircle className="w-6 h-6 flex-shrink-0" aria-hidden="true" />
                          <span className="text-lg">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={handleFinalCTA}
                    disabled={isLoading}
                    className="w-full mt-8 px-8 py-5 bg-white text-emerald-600 text-xl font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    aria-label={isLoading ? 'Processando compra...' : 'Compre agora'}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      'Compre agora'
                    )}
                  </button>
                  <p className="text-center mt-4 text-white/80 text-sm">
                    Mais de 10.000 pessoas já transformaram suas finanças
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes loading-bar {
            0% {
              width: 0%;
            }
            100% {
              width: 100%;
            }
          }

          @keyframes slide-in {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }

          .animate-loading-bar {
            animation: loading-bar 3s ease-out;
          }

          .animate-slide-in {
            animation: slide-in 0.3s ease-out;
          }
        `}</style>
      </div>
    </ErrorBoundary>
  );
}
