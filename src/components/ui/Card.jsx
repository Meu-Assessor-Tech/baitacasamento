import { motion } from 'framer-motion'

export default function Card({ children, className = '', hover = false, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' } : {}}
      transition={{ duration: 0.2 }}
      className={`
        bg-white rounded-2xl border border-stone-100
        shadow-sm
        ${hover ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}
