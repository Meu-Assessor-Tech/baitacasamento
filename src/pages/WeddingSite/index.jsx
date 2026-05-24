import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, MapPin, Calendar, ChevronDown } from 'lucide-react'
import Countdown from '../../components/shared/Countdown'
import GiftCard from '../../components/shared/GiftCard'
import Button from '../../components/ui/Button'
import { useWedding } from '../../context/WeddingContext'
import { mockGifts } from '../../data/mockGifts'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

export default function WeddingSite() {
  const { slug } = useParams()
  const { wedding } = useWedding()
  const [rsvpName, setRsvpName] = useState('')
  const [rsvpGuests, setRsvpGuests] = useState('1')
  const [rsvpSent, setRsvpSent] = useState(false)

  const handleRsvp = (e) => {
    e.preventDefault()
    setRsvpSent(true)
  }

  const formattedDate = new Date(wedding.date).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img src={wedding.coverImage} alt="Wedding" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>

        <div className="relative z-10 text-center text-white px-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xs uppercase tracking-[0.3em] text-white/70 mb-6"
          >
            Save the Date
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-serif text-5xl sm:text-7xl md:text-8xl leading-tight mb-6"
          >
            {wedding.brideName}
            <br />
            <span className="text-white/50 text-3xl sm:text-4xl font-light">&</span>
            <br />
            {wedding.groomName}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-white/80 text-lg capitalize mb-10"
          >
            {formattedDate}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-white/60 text-sm italic max-w-md mx-auto"
          >
            "{wedding.message}"
          </motion.p>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
        >
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* Countdown */}
      <section className="py-20 px-4 bg-sand-50">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <p className="text-xs uppercase tracking-widest text-stone-400 mb-3">Contagem regressiva</p>
            <h2 className="font-serif text-3xl text-stone-900 mb-10">Faltam apenas...</h2>
            <Countdown targetDate={wedding.date} />
            <div className="mt-10 flex items-center justify-center gap-6 text-stone-500 text-sm">
              <span className="flex items-center gap-2">
                <Calendar size={14} />
                {new Date(wedding.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <span className="w-1 h-1 bg-stone-300 rounded-full" />
              <span className="flex items-center gap-2">
                <MapPin size={14} />
                {wedding.venue}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <p className="text-xs uppercase tracking-widest text-stone-400 mb-3">Nossa história</p>
            <h2 className="font-serif text-4xl text-stone-900">Como tudo começou</h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="flex items-center justify-center mb-8">
              <Heart size={24} className="text-sand-400 fill-sand-400" />
            </div>
            <p className="text-stone-600 leading-relaxed text-center text-lg font-light italic">
              "{wedding.story}"
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 px-4 bg-stone-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <p className="text-xs uppercase tracking-widest text-stone-400 mb-3">Galeria</p>
            <h2 className="font-serif text-4xl text-stone-900">Nossos momentos</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {wedding.galleryImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="aspect-square overflow-hidden rounded-2xl cursor-pointer"
              >
                <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gift List */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <p className="text-xs uppercase tracking-widest text-stone-400 mb-3">Lista de presentes</p>
            <h2 className="font-serif text-4xl text-stone-900 mb-4">Presenteie com amor</h2>
            <p className="text-stone-500 max-w-md mx-auto text-sm">
              Cada presente é uma forma especial de celebrar este momento com a gente.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockGifts.map((gift, i) => (
              <motion.div
                key={gift.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GiftCard gift={gift} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section className="py-24 px-4 bg-sand-50">
        <div className="max-w-md mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-widest text-stone-400 mb-3">Confirmação</p>
              <h2 className="font-serif text-4xl text-stone-900 mb-3">Confirme sua presença</h2>
              <p className="text-stone-500 text-sm">Precisamos saber até 30 de agosto de 2025.</p>
            </div>

            {rsvpSent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-8 text-center border border-stone-100 shadow-sm"
              >
                <Heart size={32} className="text-sand-500 fill-sand-500 mx-auto mb-4" />
                <h3 className="font-serif text-2xl text-stone-900 mb-2">Presença confirmada!</h3>
                <p className="text-stone-500 text-sm">Mal podemos esperar para celebrar com você!</p>
              </motion.div>
            ) : (
              <div className="bg-white rounded-2xl p-8 border border-stone-100 shadow-sm">
                <form onSubmit={handleRsvp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Seu nome</label>
                    <input
                      type="text"
                      value={rsvpName}
                      onChange={e => setRsvpName(e.target.value)}
                      placeholder="Nome completo"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-400 focus:ring-2 focus:ring-stone-100 outline-none text-stone-900 placeholder-stone-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Número de acompanhantes</label>
                    <select
                      value={rsvpGuests}
                      onChange={e => setRsvpGuests(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-400 outline-none text-stone-900 bg-white"
                    >
                      {['Apenas eu', '+ 1 pessoa', '+ 2 pessoas', '+ 3 pessoas'].map((opt, i) => (
                        <option key={i} value={i}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <Button type="submit" variant="primary" size="lg" fullWidth>
                    <Heart size={16} className="fill-white" /> Confirmar presença
                  </Button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 text-center border-t border-stone-100">
        <Heart size={20} className="text-sand-400 fill-sand-400 mx-auto mb-4" />
        <p className="font-serif text-xl text-stone-900 mb-2">
          {wedding.brideName} & {wedding.groomName}
        </p>
        <p className="text-stone-400 text-sm mb-6 capitalize">{formattedDate}</p>
        <p className="text-xs text-stone-300">
          Site criado com{' '}
          <a href="/" className="text-sand-500 hover:underline">Nosso Dia</a>
        </p>
      </footer>
    </div>
  )
}
