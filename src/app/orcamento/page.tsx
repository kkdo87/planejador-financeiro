'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function OrcamentoPage() {
  useEffect(() => {
    // Redireciona para o dashboard com a aba de orçamento
    window.location.href = '/dashboard';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-xl text-gray-600">Redirecionando para o painel...</p>
      </div>
    </div>
  );
}
