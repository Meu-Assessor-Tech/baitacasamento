import { useState, useEffect } from 'react'

function TimeUnit({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-serif font-light text-stone-900">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs text-stone-400 uppercase tracking-widest mt-1">{label}</div>
    </div>
  )
}

export default function Countdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(targetDate) - new Date()
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }
    calculate()
    const timer = setInterval(calculate, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex items-center gap-6 sm:gap-10">
      <TimeUnit value={timeLeft.days} label="dias" />
      <span className="text-2xl text-stone-300 font-light">·</span>
      <TimeUnit value={timeLeft.hours} label="horas" />
      <span className="text-2xl text-stone-300 font-light">·</span>
      <TimeUnit value={timeLeft.minutes} label="min" />
      <span className="text-2xl text-stone-300 font-light">·</span>
      <TimeUnit value={timeLeft.seconds} label="seg" />
    </div>
  )
}
