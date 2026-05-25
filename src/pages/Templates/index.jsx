import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import Sidebar from '../../components/layout/Sidebar'
import Button from '../../components/ui/Button'
import { mockTemplates } from '../../data/mockTemplates'
import { useWedding } from '../../context/WeddingContext'

export default function Templates() {
  const { wedding, updateWedding } = useWedding()
  const navigate = useNavigate()
  const template = mockTemplates[0]

  const handleConfirm = () => {
    updateWedding({ template: template.id })
    navigate('/editor')
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      <main className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <p className="text-[9px] uppercase tracking-[0.5em] text-sand-500 mb-3">Template</p>
            <h1 className="font-serif text-4xl text-stone-900 mb-3">
              {template.name}
            </h1>
            <p className="text-stone-500 text-sm max-w-md leading-relaxed">
              {template.description}
            </p>
          </motion.div>

          {/* Full preview card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl overflow-hidden border-2 border-stone-900 shadow-2xl mb-8"
          >
            {/* Hero mockup */}
            <div className="relative h-72 sm:h-96">
              <img
                src={template.preview}
                alt={template.name}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to bottom, rgba(10,8,6,0.45) 0%, rgba(10,8,6,0.2) 45%, rgba(10,8,6,0.6) 100%)' }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-8">
                <p className="text-[9px] uppercase tracking-[0.5em] text-white/40 mb-6">Save the Date</p>
                <p className="font-serif text-4xl sm:text-5xl text-white leading-none">Sofia</p>
                <div className="flex items-center gap-4 my-3">
                  <div className="w-10 h-px bg-white/20" />
                  <span className="font-serif italic text-white/30 text-lg">&</span>
                  <div className="w-10 h-px bg-white/20" />
                </div>
                <p className="font-serif text-4xl sm:text-5xl text-white leading-none">Lucas</p>
                <p className="mt-6 text-[10px] uppercase tracking-[0.45em] text-white/35">20 de setembro de 2025</p>
              </div>
              <div className="absolute top-4 left-4">
                <span className="bg-white/10 backdrop-blur-sm text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/20">
                  {template.tag}
                </span>
              </div>
              <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Check size={14} className="text-stone-900" />
              </div>
            </div>

            {/* Section mockup */}
            <div className="bg-[#FAFAF8] px-8 py-8 border-t border-stone-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-stone-200" />
                <div className="w-1.5 h-1.5 rounded-full bg-sand-400" />
                <div className="flex-1 h-px bg-stone-200" />
              </div>
              <div className="text-center mb-6">
                <p className="text-[9px] uppercase tracking-[0.5em] text-sand-500 mb-2">Nossa história</p>
                <p className="font-serif text-2xl text-stone-900">Como tudo começou</p>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=300',
                  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=300',
                  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=300',
                ].map((img, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden bg-stone-100">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-stone-400">
                <div className="flex gap-1.5">
                  {template.colors.map((c, i) => (
                    <div key={i} className="w-4 h-4 rounded-full border border-stone-200" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <span className="font-medium text-stone-500">Ivory Template</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-end"
          >
            <Button variant="primary" size="lg" onClick={handleConfirm}>
              Usar este template
              <ArrowRight size={16} />
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
