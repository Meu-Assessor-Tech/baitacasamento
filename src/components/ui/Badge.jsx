const colors = {
  default: 'bg-stone-100 text-stone-700',
  sand: 'bg-sand-100 text-sand-700',
  green: 'bg-green-50 text-green-700',
  blue: 'bg-blue-50 text-blue-700',
}

export default function Badge({ children, color = 'default', className = '' }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colors[color]} ${className}`}>
      {children}
    </span>
  )
}
