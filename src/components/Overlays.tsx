import { motion } from 'motion/react';
import { ArrowRight, Check, House, RotateCcw, Sparkles } from 'lucide-react';

type HomeProps = { onStart: () => void };
type EndProps = { onRestart: () => void; onHome: () => void };

export function HomeOverlay({ onStart }: HomeProps) {
  return (
    <motion.div className="screen-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="intro-card" initial={{ opacity: 0, y: 28, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .58, ease: 'easeOut' }}>
        <div className="brand-ornament"><Sparkles size={21} /></div>
        <span className="intro-eyebrow">УЮТНАЯ МИНИ-ИГРА</span>
        <h1>Свет<br /><em>погаси!</em></h1>
        <p>Маленькое приключение на большой кухне. Перед уходом убедись, что дома всё в порядке.</p>
        <div className="intro-steps"><span>01 · Свет</span><span>02 · Чайник</span><span>03 · Вентилятор</span></div>
        <button type="button" className="primary-button" onClick={onStart}>Начать игру <ArrowRight size={19} /></button>
        <div className="intro-subline">Point & Click <span>✦</span> 2D Adventure</div>
      </motion.div>
    </motion.div>
  );
}

export function EndOverlay({ onRestart, onHome }: EndProps) {
  return <motion.div className="screen-overlay end-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <motion.div className="end-card" initial={{ opacity: 0, y: 32, scale: .85 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 18 }}>
      <div className="success-seal"><Check size={40} strokeWidth={3} /></div>
      <div className="intro-eyebrow">МИССИЯ ВЫПОЛНЕНА</div>
      <h2>Поздравляем!</h2>
      <p className="end-lead">Ты сделал кухню <em>безопасной!</em></p>
      <p className="end-secondary">Все приборы выключены, свет погашен. Теперь можно спокойно выходить из дома.</p>
      <div className="achievement"><Sparkles size={18} /> <span>Получено достижение</span><strong>Хранитель уюта</strong></div>
      <div className="end-actions">
        <button type="button" className="primary-button" onClick={onRestart}><RotateCcw size={18} /> Играть снова</button>
        <button type="button" className="secondary-button" onClick={onHome}><House size={17} /> На главную</button>
      </div>
    </motion.div>
    <div className="confetti confetti-1" /><div className="confetti confetti-2" /><div className="confetti confetti-3" /><div className="confetti confetti-4" />
  </motion.div>;
}
