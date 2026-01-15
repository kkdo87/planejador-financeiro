export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizStep {
  id: number;
  type: 'welcome' | 'question' | 'education' | 'email' | 'loading' | 'results' | 'benefits' | 'offer';
  title?: string;
  subtitle?: string;
  content?: string;
  question?: string;
  options?: QuizOption[];
  cta?: string;
}

export const quizSteps: QuizStep[] = [
  {
    id: 0,
    type: 'welcome',
    title: 'Descubra como se livrar das dívidas e ter o controle das suas finanças!',
    subtitle: 'Responda em menos de 3 minutos e receba um plano financeiro personalizado.',
    cta: 'Clique para começar'
  },
  {
    id: 1,
    type: 'question',
    question: 'Qual a sua idade?',
    options: [
      { id: 'age_1', text: 'Menos de 25 anos' },
      { id: 'age_2', text: '25 a 35 anos' },
      { id: 'age_3', text: '36 a 50 anos' },
      { id: 'age_4', text: 'Mais de 50 anos' }
    ]
  },
  {
    id: 2,
    type: 'question',
    question: 'Qual a sua situação atual em relação às dívidas?',
    options: [
      { id: 'debt_1', text: 'Sem dívidas' },
      { id: 'debt_2', text: 'Dívidas controláveis' },
      { id: 'debt_3', text: 'Dívidas altas' },
      { id: 'debt_4', text: 'Endividado até o pescoço' }
    ]
  },
  {
    id: 3,
    type: 'question',
    question: 'Qual é sua maior preocupação financeira atualmente?',
    options: [
      { id: 'concern_1', text: 'Ficar sem dinheiro no final do mês' },
      { id: 'concern_2', text: 'Pagar contas' },
      { id: 'concern_3', text: 'Sair das dívidas' },
      { id: 'concern_4', text: 'Poupar para o futuro' }
    ]
  },
  {
    id: 4,
    type: 'education',
    content: 'Entender suas finanças é o primeiro passo para a liberdade financeira. Vamos juntos descobrir como você pode mudar sua relação com o dinheiro e as dívidas.'
  },
  {
    id: 5,
    type: 'question',
    question: 'Com que frequência você se preocupa com suas dívidas?',
    options: [
      { id: 'frequency_1', text: 'Raramente' },
      { id: 'frequency_2', text: 'Às vezes' },
      { id: 'frequency_3', text: 'Frequentemente' },
      { id: 'frequency_4', text: 'Quase todo dia' }
    ]
  },
  {
    id: 6,
    type: 'question',
    question: 'O que mais te impede de pagar suas dívidas?',
    options: [
      { id: 'impediment_1', text: 'Gastos excessivos' },
      { id: 'impediment_2', text: 'Falta de um planejamento' },
      { id: 'impediment_3', text: 'Imprevistos financeiros' },
      { id: 'impediment_4', text: 'Outros' }
    ]
  },
  {
    id: 7,
    type: 'question',
    question: 'Você já tentou algum método para sair das dívidas?',
    options: [
      { id: 'method_1', text: 'Sim, e funcionou' },
      { id: 'method_2', text: 'Sim, mas não funcionou' },
      { id: 'method_3', text: 'Não, nunca tentei' },
      { id: 'method_4', text: 'Estou tentando agora' }
    ]
  },
  {
    id: 8,
    type: 'education',
    content: 'Os estudos mostram que o planejamento financeiro pode reduzir suas dívidas em até 50% em um ano, se feito de maneira eficaz.'
  },
  {
    id: 9,
    type: 'question',
    question: 'Como você se sente ao pensar nas suas dívidas?',
    options: [
      { id: 'feeling_1', text: 'Ansioso' },
      { id: 'feeling_2', text: 'Triste' },
      { id: 'feeling_3', text: 'Indiferente' },
      { id: 'feeling_4', text: 'Determinado a mudar' }
    ]
  },
  {
    id: 10,
    type: 'question',
    question: 'Qual percentual do seu rendimento mensal você destina para o pagamento de dívidas?',
    options: [
      { id: 'percentage_1', text: 'Menos de 20%' },
      { id: 'percentage_2', text: 'Entre 20% e 50%' },
      { id: 'percentage_3', text: 'Mais de 50%' },
      { id: 'percentage_4', text: 'Não sei' }
    ]
  },
  {
    id: 11,
    type: 'education',
    content: 'Mais de 70% das pessoas que utilizam um planejamento financeiro adequado conseguem sair das dívidas em menos de 18 meses.'
  },
  {
    id: 12,
    type: 'email',
    title: 'Para obter sua análise e plano financeiro personalizado, deixe seu e-mail abaixo.',
    cta: 'Continuar'
  },
  {
    id: 13,
    type: 'loading',
    content: 'Estamos analisando suas respostas. Isso só levará alguns segundos...'
  },
  {
    id: 14,
    type: 'results',
    title: 'Analisamos suas respostas e aqui está o seu perfil financeiro!',
    content: 'Com base nas suas respostas, identificamos oportunidades específicas para melhorar sua saúde financeira.'
  },
  {
    id: 15,
    type: 'benefits',
    title: 'Com o PoupApp, você terá acesso a:',
    content: 'Ferramentas que ajudarão a criar um orçamento, monitorar suas despesas e planejar seu futuro financeiro.'
  },
  {
    id: 16,
    type: 'education',
    content: '90% dos nossos usuários relataram uma melhora significativa na gestão de suas finanças em apenas 3 meses de uso do PoupApp.'
  },
  {
    id: 17,
    type: 'offer',
    title: 'Baixe agora o PoupApp e comece sua jornada rumo à liberdade financeira!',
    subtitle: 'Aproveite por apenas R$ 19,90 por mês!',
    cta: 'Comece agora'
  }
];

export const getProfileAnalysis = (answers: Record<string, string>) => {
  const profiles = {
    beginner: {
      title: 'Iniciante Financeiro',
      description: 'Você está começando sua jornada de organização financeira. Com as ferramentas certas, você pode construir uma base sólida.',
      tips: ['Crie um orçamento mensal', 'Registre todas as despesas', 'Estabeleça metas pequenas']
    },
    intermediate: {
      title: 'Organizador em Progresso',
      description: 'Você já tem consciência financeira, mas precisa de ferramentas para otimizar seu controle.',
      tips: ['Automatize suas economias', 'Revise gastos mensalmente', 'Crie um fundo de emergência']
    },
    advanced: {
      title: 'Gestor Financeiro',
      description: 'Você tem bom controle, mas pode melhorar ainda mais com planejamento estratégico.',
      tips: ['Invista em educação financeira', 'Diversifique investimentos', 'Planeje aposentadoria']
    },
    critical: {
      title: 'Situação Crítica',
      description: 'Sua situação requer atenção imediata. Vamos criar um plano de recuperação financeira.',
      tips: ['Negocie dívidas urgentemente', 'Corte gastos não essenciais', 'Busque renda extra']
    }
  };

  // Lógica simples de análise baseada nas respostas
  const debtSituation = answers['debt'];
  const concern = answers['concern'];
  
  if (debtSituation === 'debt_4' || concern === 'concern_3') {
    return profiles.critical;
  } else if (debtSituation === 'debt_3') {
    return profiles.intermediate;
  } else if (debtSituation === 'debt_2') {
    return profiles.intermediate;
  } else {
    return profiles.beginner;
  }
};
