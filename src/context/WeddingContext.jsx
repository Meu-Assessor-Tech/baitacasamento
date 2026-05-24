import { createContext, useContext, useState } from 'react'
import { mockWedding } from '../data/mockWedding'

const WeddingContext = createContext(null)

export function WeddingProvider({ children }) {
  const [wedding, setWedding] = useState(mockWedding)

  const updateWedding = (updates) => {
    setWedding(prev => ({ ...prev, ...updates }))
  }

  return (
    <WeddingContext.Provider value={{ wedding, updateWedding }}>
      {children}
    </WeddingContext.Provider>
  )
}

export const useWedding = () => useContext(WeddingContext)
