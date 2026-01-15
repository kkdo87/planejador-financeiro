// ================================
// AUTENTICAÇÃO (LOCAL STORAGE)
// ================================

export async function signUp(email: string, password: string, name: string) {
  // Simulação de signup com localStorage
  const user = {
    id: crypto.randomUUID(),
    email,
    name,
    created_at: new Date().toISOString()
  }
  
  localStorage.setItem('user', JSON.stringify(user))
  return { user }
}

export async function signIn(email: string, password: string) {
  // Simulação de login com localStorage
  const userStr = localStorage.getItem('user')
  if (!userStr) {
    throw new Error('Usuário não encontrado')
  }
  
  const user = JSON.parse(userStr)
  return { user }
}

export async function signOut() {
  localStorage.removeItem('user')
}

export async function getCurrentUser() {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

// ================================
// RENDA (LOCAL STORAGE)
// ================================

export async function saveIncome(userId: string, amount: number) {
  const income = {
    id: crypto.randomUUID(),
    user_id: userId,
    amount,
    created_at: new Date().toISOString()
  }
  
  localStorage.setItem('income', JSON.stringify(income))
  return income
}

export async function getIncome(userId: string) {
  const incomeStr = localStorage.getItem('income')
  return incomeStr ? JSON.parse(incomeStr) : null
}

// ================================
// GASTOS (LOCAL STORAGE)
// ================================

export async function saveExpenses(userId: string, expenses: Array<{
  category: string
  amount: number
  type: 'fixed' | 'variable'
}>) {
  const expensesWithUser = expenses.map(exp => ({
    ...exp,
    id: crypto.randomUUID(),
    user_id: userId,
    created_at: new Date().toISOString()
  }))
  
  const existingExpenses = getExpensesSync(userId)
  const allExpenses = [...existingExpenses, ...expensesWithUser]
  localStorage.setItem('expenses', JSON.stringify(allExpenses))
  
  return expensesWithUser
}

export async function saveExpense(userId: string, category: string, amount: number, type: 'fixed' | 'variable') {
  const expense = {
    id: crypto.randomUUID(),
    user_id: userId,
    category,
    amount,
    type,
    created_at: new Date().toISOString()
  }
  
  const existingExpenses = getExpensesSync(userId)
  const allExpenses = [...existingExpenses, expense]
  localStorage.setItem('expenses', JSON.stringify(allExpenses))
  
  return expense
}

export async function deleteExpense(expenseId: string) {
  const expensesStr = localStorage.getItem('expenses')
  if (!expensesStr) return
  
  const expenses = JSON.parse(expensesStr)
  const filtered = expenses.filter((exp: any) => exp.id !== expenseId)
  localStorage.setItem('expenses', JSON.stringify(filtered))
}

export async function getExpenses(userId: string) {
  return getExpensesSync(userId)
}

function getExpensesSync(userId: string) {
  const expensesStr = localStorage.getItem('expenses')
  if (!expensesStr) return []
  
  const expenses = JSON.parse(expensesStr)
  return expenses.filter((exp: any) => exp.user_id === userId)
}

// ================================
// DÍVIDAS (LOCAL STORAGE)
// ================================

export async function saveDebts(userId: string, debts: Array<{
  debt_type: string
  description: string
  total_amount: number
  monthly_payment: number
  interest_rate?: number
}>) {
  const debtsWithUser = debts.map(debt => ({
    ...debt,
    id: crypto.randomUUID(),
    user_id: userId,
    created_at: new Date().toISOString()
  }))
  
  localStorage.setItem('debts', JSON.stringify(debtsWithUser))
  return debtsWithUser
}

export async function getDebts(userId: string) {
  const debtsStr = localStorage.getItem('debts')
  if (!debtsStr) return []
  
  const debts = JSON.parse(debtsStr)
  return debts.filter((debt: any) => debt.user_id === userId)
}

// ================================
// DIAGNÓSTICO IA (LOCAL STORAGE)
// ================================

export async function saveDiagnosis(
  userId: string,
  diagnosisText: string,
  riskLevel: 'controlável' | 'risco' | 'crítico'
) {
  const diagnosis = {
    id: crypto.randomUUID(),
    user_id: userId,
    diagnosis_text: diagnosisText,
    risk_level: riskLevel,
    created_at: new Date().toISOString()
  }
  
  localStorage.setItem('diagnosis', JSON.stringify(diagnosis))
  return diagnosis
}

export async function getDiagnosis(userId: string) {
  const diagnosisStr = localStorage.getItem('diagnosis')
  return diagnosisStr ? JSON.parse(diagnosisStr) : null
}

// ================================
// PLANO DE SAÍDA (LOCAL STORAGE)
// ================================

export async function savePlan(
  userId: string,
  strategy: 'bola_neve' | 'avalanche',
  monthlyAmount: number,
  estimatedMonths: number,
  planText: string
) {
  const plan = {
    id: crypto.randomUUID(),
    user_id: userId,
    strategy,
    monthly_amount: monthlyAmount,
    estimated_months: estimatedMonths,
    plan_text: planText,
    created_at: new Date().toISOString()
  }
  
  localStorage.setItem('plan', JSON.stringify(plan))
  return plan
}

export async function getPlan(userId: string) {
  const planStr = localStorage.getItem('plan')
  return planStr ? JSON.parse(planStr) : null
}

// ================================
// ALERTAS (LOCAL STORAGE)
// ================================

export async function saveAlert(
  userId: string,
  alertText: string,
  severity: 'info' | 'warning' | 'danger'
) {
  const alert = {
    id: crypto.randomUUID(),
    user_id: userId,
    alert_text: alertText,
    severity,
    created_at: new Date().toISOString()
  }
  
  const existingAlerts = getAlertsSync(userId)
  const allAlerts = [alert, ...existingAlerts].slice(0, 5)
  localStorage.setItem('alerts', JSON.stringify(allAlerts))
  
  return alert
}

export async function getAlerts(userId: string) {
  return getAlertsSync(userId)
}

function getAlertsSync(userId: string) {
  const alertsStr = localStorage.getItem('alerts')
  if (!alertsStr) return []
  
  const alerts = JSON.parse(alertsStr)
  return alerts.filter((alert: any) => alert.user_id === userId).slice(0, 5)
}

// ================================
// SIMULAÇÕES (LOCAL STORAGE)
// ================================

export async function saveSimulation(
  userId: string,
  scenario: string,
  resultText: string
) {
  const simulation = {
    id: crypto.randomUUID(),
    user_id: userId,
    scenario,
    result_text: resultText,
    created_at: new Date().toISOString()
  }
  
  const existingSimulations = getSimulationsSync(userId)
  const allSimulations = [simulation, ...existingSimulations].slice(0, 10)
  localStorage.setItem('simulations', JSON.stringify(allSimulations))
  
  return simulation
}

export async function getSimulations(userId: string) {
  return getSimulationsSync(userId)
}

function getSimulationsSync(userId: string) {
  const simulationsStr = localStorage.getItem('simulations')
  if (!simulationsStr) return []
  
  const simulations = JSON.parse(simulationsStr)
  return simulations.filter((sim: any) => sim.user_id === userId).slice(0, 10)
}

// ================================
// PROGRESSO (LOCAL STORAGE)
// ================================

export async function saveProgress(
  userId: string,
  totalDebtStart: number,
  totalDebtCurrent: number,
  savedAmount: number
) {
  const progress = {
    id: crypto.randomUUID(),
    user_id: userId,
    total_debt_start: totalDebtStart,
    total_debt_current: totalDebtCurrent,
    saved_amount: savedAmount,
    created_at: new Date().toISOString()
  }
  
  localStorage.setItem('progress', JSON.stringify(progress))
  return progress
}

export async function getProgress(userId: string) {
  const progressStr = localStorage.getItem('progress')
  return progressStr ? JSON.parse(progressStr) : null
}

// ================================
// IA - GERAÇÃO DE CONTEÚDO
// ================================

export async function generateDiagnosis(
  renda: number,
  gastosFixos: number,
  gastosVariaveis: number,
  dividas: Array<{ tipo: string; valor: number; parcela: number; juros?: number }>
) {
  const response = await fetch('/api/ai/diagnosis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ renda, gastosFixos, gastosVariaveis, dividas })
  })
  
  if (!response.ok) throw new Error('Erro ao gerar diagnóstico')
  return response.json()
}

export async function generatePlan(
  renda: number,
  gastosFixos: number,
  gastosVariaveis: number,
  dividas: Array<{ tipo: string; descricao: string; valor: number; parcela: number; juros?: number }>
) {
  const response = await fetch('/api/ai/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ renda, gastosFixos, gastosVariaveis, dividas })
  })
  
  if (!response.ok) throw new Error('Erro ao gerar plano')
  return response.json()
}

export async function generateAlert(
  descricao: string,
  valor: number,
  orcamento: number
) {
  const response = await fetch('/api/ai/alert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ descricao, valor, orcamento })
  })
  
  if (!response.ok) throw new Error('Erro ao gerar alerta')
  return response.json()
}

export async function generateSimulation(
  dadosFinanceiros: any,
  cenario: string
) {
  const response = await fetch('/api/ai/simulation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dadosFinanceiros, cenario })
  })
  
  if (!response.ok) throw new Error('Erro ao gerar simulação')
  return response.json()
}
