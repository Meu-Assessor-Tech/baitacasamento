import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Monitor, Smartphone, Save, Upload, Plus, Check, Trash2, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/layout/Sidebar'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useWedding } from '../../context/WeddingContext'
import { mockGifts } from '../../data/mockGifts'
import { templateConfigs } from '../../data/templateConfigs'

const TABS = [
  { id: 'content', label: 'Conteúdo' },
  { id: 'design', label: 'Design' },
  { id: 'gifts', label: 'Presentes' },
  { id: 'share', label: 'Compartilhar' },
]

const COLORS = [
  { label: 'Areia', value: '#8B6F5E' },
  { label: 'Rosa', value: '#C4858E' },
  { label: 'Sage', value: '#7A9A7A' },
  { label: 'Azul', value: '#6B8CAE' },
  { label: 'Preto', value: '#1A1A1A' },
  { label: 'Dourado', value: '#B8922A' },
]

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function Editor() {
  const { wedding, updateWedding, resetWedding } = useWedding()
  const [activeTab, setActiveTab] = useState('content')
  const [previewMode, setPreviewMode] = useState('desktop')
  const [saved, setSaved] = useState(false)
  const coverInputRef = useRef(null)
  const galleryInputRef = useRef(null)
  const navigate = useNavigate()

  const cfg = templateConfigs[wedding.template] || templateConfigs.classic

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const dataUrl = await readFileAsDataURL(file)
    updateWedding({ coverImage: dataUrl })
    e.target.value = ''
  }

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    const dataUrls = await Promise.all(files.map(readFileAsDataURL))
    updateWedding({ galleryImages: [...wedding.galleryImages, ...dataUrls] })
    e.target.value = ''
  }

  const removeGalleryImage = (index) => {
    updateWedding({ galleryImages: wedding.galleryImages.filter((_, i) => i !== index) })
  }

  return (
    <div className="flex min-h-screen bg-stone-100">
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col overflow-hidden min-h-screen">
        <div className="bg-white border-b border-stone-100 px-4 sm:px-6 h-14 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/site/${wedding.slug}`)}
              title="Ver site publicado"
            >
              <Eye size={14} /> Ver site
            </Button>
            <div className="hidden sm:flex items-center gap-1 bg-stone-100 rounded-full p-1">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`p-1.5 rounded-full transition-colors ${previewMode === 'desktop' ? 'bg-white shadow-sm' : ''}`}
              >
                <Monitor size={14} className="text-stone-600" />
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`p-1.5 rounded-full transition-colors ${previewMode === 'mobile' ? 'bg-white shadow-sm' : ''}`}
              >
                <Smartphone size={14} className="text-stone-600" />
              </button>
            </div>
            <Button variant="primary" size="sm" onClick={handleSave}>
              {saved ? <><Check size={14} /> Salvo!</> : <><Save size={14} /> Salvar</>}
            </Button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-72 bg-white border-r border-stone-100 overflow-y-auto flex-shrink-0">
            <div className="p-5">
              {activeTab === 'content' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  <h2 className="font-medium text-stone-900 text-sm">Informações do casal</h2>
                  <Input
                    label="Nome da noiva"
                    value={wedding.brideName}
                    onChange={e => updateWedding({ brideName: e.target.value })}
                  />
                  <Input
                    label="Nome do noivo"
                    value={wedding.groomName}
                    onChange={e => updateWedding({ groomName: e.target.value })}
                  />
                  <Input
                    label="Data do casamento"
                    type="date"
                    value={wedding.date}
                    onChange={e => updateWedding({ date: e.target.value })}
                  />
                  <Input
                    label="Local da cerimônia"
                    value={wedding.venue}
                    onChange={e => updateWedding({ venue: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Mensagem especial</label>
                    <textarea
                      value={wedding.message}
                      onChange={e => updateWedding({ message: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-400 focus:ring-2 focus:ring-stone-100 outline-none text-sm text-stone-900 placeholder-stone-400 transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Nossa história</label>
                    <textarea
                      value={wedding.story}
                      onChange={e => updateWedding({ story: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-400 focus:ring-2 focus:ring-stone-100 outline-none text-sm text-stone-900 placeholder-stone-400 transition-all resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === 'design' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div>
                    <h2 className="font-medium text-stone-900 text-sm mb-1">Template ativo</h2>
                    <p className="text-xs text-stone-400 mb-3">{cfg.label}</p>
                    <Button variant="outline" size="sm" fullWidth onClick={() => navigate('/templates')}>
                      Trocar template
                    </Button>
                  </div>

                  <div>
                    <h2 className="font-medium text-stone-900 text-sm mb-4">Cor principal</h2>
                    <div className="grid grid-cols-3 gap-2">
                      {COLORS.map(color => (
                        <button
                          key={color.value}
                          onClick={() => updateWedding({ primaryColor: color.value })}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                            wedding.primaryColor === color.value ? 'border-stone-900' : 'border-stone-100 hover:border-stone-300'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: color.value }} />
                          <span className="text-xs text-stone-600">{color.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="font-medium text-stone-900 text-sm mb-3">Foto de capa</h2>
                    <div className="aspect-video rounded-xl overflow-hidden mb-3 bg-stone-100">
                      <img src={wedding.coverImage} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverUpload}
                    />
                    <Button variant="outline" size="sm" fullWidth onClick={() => coverInputRef.current?.click()}>
                      <Upload size={14} /> Alterar foto de capa
                    </Button>
                  </div>

                  <div>
                    <h2 className="font-medium text-stone-900 text-sm mb-3">Galeria de fotos</h2>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {wedding.galleryImages.map((img, i) => (
                        <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-stone-100">
                          <img src={img} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                          <button
                            onClick={() => removeGalleryImage(i)}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <Trash2 size={14} className="text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleGalleryUpload}
                    />
                    <Button variant="outline" size="sm" fullWidth onClick={() => galleryInputRef.current?.click()}>
                      <Plus size={14} /> Adicionar fotos à galeria
                    </Button>
                  </div>

                  <div className="pt-2 border-t border-stone-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      onClick={() => { if (confirm('Resetar todos os dados para o exemplo padrão?')) resetWedding() }}
                      className="!text-red-400 hover:!text-red-600 hover:!bg-red-50"
                    >
                      Resetar dados
                    </Button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'gifts' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-medium text-stone-900 text-sm">Lista de presentes</h2>
                    <Button variant="outline" size="sm">
                      <Plus size={14} /> Adicionar
                    </Button>
                  </div>
                  {mockGifts.map(gift => (
                    <div key={gift.id} className="flex items-center gap-3 p-3 rounded-xl border border-stone-100 bg-stone-50">
                      <img src={gift.image} alt={gift.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-900 truncate">{gift.name}</p>
                        <p className="text-xs text-stone-400">R$ {gift.price.toLocaleString('pt-BR')}</p>
                      </div>
                      {gift.purchased && <Check size={14} className="text-green-500 flex-shrink-0" />}
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'share' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  <h2 className="font-medium text-stone-900 text-sm">Compartilhar site</h2>
                  <div className="bg-stone-50 rounded-xl p-4">
                    <p className="text-xs text-stone-500 mb-2">Seu link exclusivo</p>
                    <p className="font-mono text-sm text-stone-900 break-all">nossodia.com/{wedding.slug}</p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={() => navigator.clipboard?.writeText(`${window.location.origin}/site/${wedding.slug}`)}
                  >
                    Copiar link
                  </Button>
                  <div className="pt-2">
                    <p className="text-xs text-stone-500 mb-3">Compartilhar via</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['WhatsApp', 'Instagram', 'E-mail', 'QR Code'].map(method => (
                        <button key={method} className="flex items-center justify-center gap-2 p-3 rounded-xl border border-stone-200 text-xs text-stone-700 hover:bg-stone-50 transition-colors">
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="flex-1 bg-stone-100 overflow-auto flex items-start justify-center p-6">
            <div className={`bg-white shadow-xl rounded-xl overflow-hidden transition-all duration-300 ${
              previewMode === 'mobile' ? 'w-80' : 'w-full max-w-3xl'
            }`}>
              <div className="relative" style={{ height: previewMode === 'mobile' ? '560px' : '500px' }}>
                <img src={wedding.coverImage} alt="Preview" className="w-full h-full object-cover" />
                <div className={`absolute inset-0`} style={{ background: cfg.heroBg }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                  <p className={cfg.labelClass}>Save the Date</p>
                  <h1 className={`${cfg.nameClass} text-white`} style={cfg.nameStyle}>
                    {wedding.brideName} <span className={cfg.ampersandClass}>&</span> {wedding.groomName}
                  </h1>
                  <p className={cfg.dateClass}>
                    {new Date(wedding.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                  {cfg.messageClass !== 'hidden' && (
                    <p className={cfg.messageClass}>"{wedding.message}"</p>
                  )}
                  <div
                    className={`mt-8 px-6 py-3 text-sm font-semibold ${cfg.btnRadius}`}
                    style={{ backgroundColor: wedding.primaryColor, color: 'white' }}
                  >
                    Confirmar Presença
                  </div>
                </div>
              </div>
              <div className={`px-6 py-8 text-center border-t ${cfg.altSectionBg} ${cfg.dividerDark}`}>
                <p className={cfg.sectionLabelDarkClass}>Nossa História</p>
                <h2 className={`${cfg.sectionHeadingDarkClass} text-2xl mb-3`}>Como nos conhecemos</h2>
                <p className={`text-sm leading-relaxed line-clamp-3 opacity-60 ${cfg.altSectionText}`}>{wedding.story}</p>
              </div>
              {wedding.galleryImages.length > 0 && (
                <div className="px-6 pb-6 grid grid-cols-3 gap-2">
                  {wedding.galleryImages.slice(0, 6).map((img, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden">
                      <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
