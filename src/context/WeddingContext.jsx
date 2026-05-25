import { createContext, useContext, useState } from 'react'
import { mockWedding } from '../data/mockWedding'

const STORAGE_KEY = 'baitacasamento_wedding'

const WeddingContext = createContext(null)

export function WeddingProvider({ children }) {
  const [wedding, setWedding] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? { ...mockWedding, ...JSON.parse(saved) } : mockWedding
    } catch {
      return mockWedding
    }
  })

  const updateWedding = (updates) => {
    setWedding(prev => {
      const next = { ...prev, ...updates }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // localStorage quota exceeded (e.g. large base64 images)
      }
      return next
    })
  }

  const resetWedding = () => {
    localStorage.removeItem(STORAGE_KEY)
    setWedding(mockWedding)
  }

  return (
    <WeddingContext.Provider value={{ wedding, updateWedding, resetWedding }}>
      {children}
    </WeddingContext.Provider>
  )
}

export const useWedding = () => useContext(WeddingContext)
