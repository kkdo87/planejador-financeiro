'use client'

import { useState } from 'react'
import { Star, Send, Loader2, CheckCircle } from 'lucide-react'

export default function FeedbackForm() {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0 || !feedback.trim()) {
      alert('Por favor, avalie e deixe um comentário')
      return
    }

    setSending(true)

    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Salvar no localStorage
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]')
    feedbacks.push({
      rating,
      feedback,
      date: new Date().toISOString()
    })
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks))

    setSending(false)
    setSent(true)

    // Reset após 3 segundos
    setTimeout(() => {
      setRating(0)
      setFeedback('')
      setSent(false)
    }, 3000)
  }

  if (sent) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Obrigado pelo feedback!</h3>
        <p className="text-gray-600">Sua opinião nos ajuda a melhorar</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      <h3 className="text-xl font-bold text-gray-900 mb-2">Deixe seu feedback</h3>
      <p className="text-gray-600 mb-6">Como está sendo sua experiência com o app?</p>

      {/* Rating Stars */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-10 h-10 ${
                star <= (hoveredRating || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Feedback Text */}
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Conte-nos mais sobre sua experiência..."
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none mb-4"
        rows={4}
      />

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={sending || rating === 0 || !feedback.trim()}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50"
      >
        {sending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Send className="w-5 h-5" />
            Enviar Feedback
          </>
        )}
      </button>
    </div>
  )
}
