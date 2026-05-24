import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Sidebar from '../../components/layout/Sidebar'
import TemplateCard from '../../components/shared/TemplateCard'
import Button from '../../components/ui/Button'
import { mockTemplates } from '../../data/mockTemplates'
import { useWedding } from '../../context/WeddingContext'

export default function Templates() {
  const { wedding, updateWedding } = useWedding()
  const [selected, setSelected] = useState(wedding.template)
  const navigate = useNavigate()

  const handleConfirm = () => {
    updateWedding({ template: selected })
    navigate('/editor')
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
          <div className="mb-10">
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-2">Personalização</p>
            <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 mb-3">
              Escolha seu template
            </h1>
            <p className="text-stone-500 text-sm max-w-lg">
              Selecione o estilo que melhor representa vocês. Você poderá personalizar cores, fontes e conteúdo depois.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            {mockTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                selected={selected === template.id}
                onSelect={setSelected}
              />
            ))}
          </motion.div>

          <div className="flex justify-end">
            <Button variant="primary" size="lg" onClick={handleConfirm} disabled={!selected}>
              Usar este template
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
