export default function Input({
  label,
  error,
  hint,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-stone-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`
          w-full px-4 py-3 rounded-xl border
          bg-white text-stone-900 placeholder-stone-400
          transition-all duration-200 outline-none
          border-stone-200
          focus:border-stone-400 focus:ring-2 focus:ring-stone-100
          ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-50' : ''}
          ${className}
        `}
      />
      {hint && !error && (
        <p className="mt-1.5 text-xs text-stone-500">{hint}</p>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}
