import { motion } from 'framer-motion'

const variants = {
  primary: 'bg-stone-900 text-white hover:bg-stone-800 active:bg-stone-900',
  secondary: 'bg-sand-100 text-stone-800 hover:bg-sand-200 active:bg-sand-300',
  outline: 'border border-stone-300 text-stone-700 hover:border-stone-500 hover:bg-stone-50',
  ghost: 'text-stone-600 hover:bg-stone-100',
  sand: 'bg-sand-600 text-white hover:bg-sand-700',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
  xl: 'px-10 py-5 text-base',
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  fullWidth = false,
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.99 }}
      className={`
        inline-flex items-center justify-center gap-2
        font-medium rounded-full tracking-wide
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {children}
    </motion.button>
  )
}
