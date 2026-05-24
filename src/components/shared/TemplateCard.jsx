import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Badge from '../ui/Badge'

export default function TemplateCard({ template, selected, onSelect }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      onClick={() => onSelect(template.id)}
      className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
        selected ? 'border-stone-900 shadow-xl' : 'border-stone-100 hover:border-stone-300 shadow-sm'
      }`}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={template.preview}
          alt={template.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {selected && (
        <div className="absolute top-3 right-3 w-8 h-8 bg-stone-900 rounded-full flex items-center justify-center shadow-lg">
          <Check size={14} className="text-white" />
        </div>
      )}

      {template.tag && (
        <div className="absolute top-3 left-3">
          <Badge color="sand">{template.tag}</Badge>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-2 mb-1">
          {template.colors.map((color, i) => (
            <div key={i} className="w-4 h-4 rounded-full border border-stone-200" style={{ backgroundColor: color }} />
          ))}
        </div>
        <h3 className="font-serif text-base font-medium text-stone-900 mt-2 mb-1">{template.name}</h3>
        <p className="text-xs text-stone-500 leading-relaxed">{template.description}</p>
      </div>
    </motion.div>
  )
}
