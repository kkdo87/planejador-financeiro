// Arquivo de tipos para compatibilidade
// O app funciona com localStorage, sem necessidade de Supabase

export type Database = {
  users: {
    id: string
    name: string
    email: string
    created_at: string
    is_premium: boolean
  }
  income: {
    id: string
    user_id: string
    amount: number
    created_at: string
  }
  expenses: {
    id: string
    user_id: string
    category: string
    amount: number
    type: 'fixed' | 'variable'
    created_at: string
  }
  debts: {
    id: string
    user_id: string
    debt_type: string
    description: string
    total_amount: number
    monthly_payment: number
    interest_rate?: number
    created_at: string
  }
  ai_diagnosis: {
    id: string
    user_id: string
    diagnosis_text: string
    risk_level: 'controlável' | 'risco' | 'crítico'
    created_at: string
  }
  ai_plans: {
    id: string
    user_id: string
    strategy: 'bola_neve' | 'avalanche'
    monthly_amount: number
    estimated_months: number
    plan_text: string
    created_at: string
  }
  alerts: {
    id: string
    user_id: string
    alert_text: string
    severity: 'info' | 'warning' | 'danger'
    created_at: string
  }
  simulations: {
    id: string
    user_id: string
    scenario: string
    result_text: string
    created_at: string
  }
  progress: {
    id: string
    user_id: string
    total_debt_start: number
    total_debt_current: number
    saved_amount: number
    created_at: string
  }
}

// Cliente mock para compatibilidade
export const supabase = {
  auth: {
    signUp: async () => ({ data: null, error: new Error('Use localStorage') }),
    signInWithPassword: async () => ({ data: null, error: new Error('Use localStorage') }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ data: { user: null } })
  },
  from: () => ({
    insert: () => ({ select: () => ({ single: async () => ({ data: null, error: new Error('Use localStorage') }) }) }),
    select: () => ({ 
      eq: () => ({ 
        order: () => ({ 
          limit: () => ({ single: async () => ({ data: null, error: { code: 'PGRST116' } }) }) 
        }) 
      }) 
    }),
    delete: () => ({ eq: async () => ({ error: null }) })
  })
}
