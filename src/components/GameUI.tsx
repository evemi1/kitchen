import { AnimatePresence, motion } from 'motion/react';
import { memo } from 'react';
import { ArrowRight, Check, RotateCcw, Volume2, VolumeX, Zap, Info, Hand } from 'lucide-react';
import type { DeviceId, DevicesState } from '../types';
import { DEVICE_NAMES } from '../types';

type Props = {
  devices: DevicesState;
  soundOn: boolean;
  onToggleSound: () => void;
  onRestart: () => void;
  onHome: () => void;
  toast: string | null;
  onSelectTask: (id: DeviceId) => void;
};

const tasks: DeviceId[] = ['light', 'kettle', 'fan'];

export const GameUI = memo(function GameUI({ devices, soundOn, onToggleSound, onRestart, onHome, toast, onSelectTask }: Props) {
  const completed = tasks.filter(id => !devices[id]).length;
  const allDone = completed === 3;
  return <div className="sidebar">
    <div className="game-toolbar">
      <button type="button" className="toolbar-control toolbar-home" onClick={onHome} title="На главную">
        <span className="toolbar-logo">✦</span> <span>Свет погаси!</span>
      </button>
      <div className="toolbar-right">
        <button type="button" className="icon-button" aria-label={soundOn ? 'Отключить звук' : 'Включить звук'} onClick={onToggleSound} title={soundOn ? 'Отключить звук' : 'Включить звук'}>
          {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
        <button type="button" className="icon-button" aria-label="Перезапустить игру" onClick={onRestart} title="Перезапустить игру"><RotateCcw size={18} /></button>
      </div>
    </div>
    <aside className="task-card" aria-label="Список заданий">
      <div className="task-eyebrow"><Zap size={14} fill="currentColor" /> МИССИЯ НА СЕГОДНЯ</div>
      <h2>Перед выходом<br />из кухни...</h2>
      <div className="task-progress-line">
        <span>Безопасность дома</span>
        <strong>{completed}<span className="fraction">/3</span></strong>
      </div>
      <div className="progress-track"><motion.div className="progress-fill" initial={false} animate={{ width: `${(completed / 3) * 100}%` }} transition={{ duration: .5, ease: 'easeOut' }} /></div>
      <div className="task-list">
        {tasks.map((id, index) => <button key={id} type="button" className={`task-row ${!devices[id] ? 'task-row--done' : ''}`} onClick={() => onSelectTask(id)} title="Перейти к предмету">
          <span className="task-check">{!devices[id] ? <Check size={14} strokeWidth={3} /> : <span>{String(index + 1).padStart(2, '0')}</span>}</span>
          <span className="task-text">{DEVICE_NAMES[id]}</span>
          {!devices[id] && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="task-done-dot" />}
        </button>)}
      </div>
      <div className={`status-banner ${allDone ? 'status-banner--complete' : ''}`}>
        {allDone ? <Check size={16} strokeWidth={3} /> : <Info size={16} />}
        <span>{allDone ? 'Всё выключено! Иди к двери.' : 'Нажимай на предметы в комнате.'}</span>
      </div>
    </aside>
    <div className="bottom-controls"><Hand size={15} /><span>Кликни по полу, чтобы идти · По предметам — чтобы взаимодействовать</span><ArrowRight size={15} /></div>
    <AnimatePresence mode="wait">
      {toast && <motion.div key={toast} className="game-toast" initial={{ opacity: 0, y: 18, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: .96 }} transition={{ duration: .24 }} role="status">{toast}</motion.div>}
    </AnimatePresence>
  </div>;
});
