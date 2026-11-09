import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Character } from './components/Character';
import { Devices } from './components/Devices';
import { GameUI } from './components/GameUI';
import { Kitchen } from './components/Kitchen';
import { EndOverlay, HomeOverlay } from './components/Overlays';
import { useSound } from './hooks/useSound';
import { INITIAL_DEVICES, INSPECTIONS, STATIONS } from './types';
import type { DeviceId, DevicesState, InspectId, Phase, Position, TargetAction } from './types';

type Move = { waypoints: Position[]; action?: TargetAction };
type Tooltip = { label: string; x: number; y: number };
const START: Position = { x: 490, y: 743 };
const WALK_SPEED = 290; // Scene-space pixels per second
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

// Furniture is above y=684. Walking uses a dedicated clear aisle at y=747.
// A short stool around x=340 is excluded from the near-wall walkable region.
function legalFloor(point: Position): Position {
  const x = clamp(point.x, 75, 1330);
  let y = clamp(point.y, 699, 792);
  if (x > 303 && x < 391) y = Math.max(725, y);
  return { x, y };
}

function makePath(from: Position, destination: Position): Position[] {
  const aisleY = 747;
  const points: Position[] = [];
  if (Math.abs(from.y - aisleY) > 3) points.push({ x: from.x, y: aisleY });
  if (Math.abs(from.x - destination.x) > 3) points.push({ x: destination.x, y: aisleY });
  points.push(destination);
  return points;
}

export default function App() {
  const [phase, setPhase] = useState<Phase>('home');
  const [devices, setDevices] = useState<DevicesState>({ ...INITIAL_DEVICES });
  const [position, setPosition] = useState<Position>({ ...START });
  const [walking, setWalking] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [facing, setFacing] = useState<1 | -1>(1);
  const [disappearing, setDisappearing] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [targetMarker, setTargetMarker] = useState<Position | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const viewportRef = useRef<HTMLElement>(null);
  const positionRef = useRef<Position>({ ...START });
  const moveRef = useRef<Move | null>(null);
  const phaseRef = useRef<Phase>('home');
  const devicesRef = useRef<DevicesState>({ ...INITIAL_DEVICES });
  const onArrivalRef = useRef<(action: TargetAction) => void>(() => {});
  const timersRef = useRef<number[]>([]);
  const toastTimerRef = useRef<number | null>(null);
  const play = useSound(soundOn);
  const completed = (Object.keys(devices) as DeviceId[]).filter(id => !devices[id]).length;
  const previousCompletedRef = useRef(completed);

  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { devicesRef.current = devices; }, [devices]);

  const schedule = useCallback((callback: () => void, delay: number) => {
    const id = window.setTimeout(callback, delay);
    timersRef.current.push(id);
    return id;
  }, []);
  const clearScheduled = useCallback(() => {
    timersRef.current.forEach(window.clearTimeout);
    timersRef.current = [];
    if (toastTimerRef.current != null) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = null;
  }, []);

  const showToast = useCallback((message: string, duration = 3400) => {
    setToast(message);
    if (toastTimerRef.current != null) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), duration);
  }, []);

  const reset = useCallback((next: Phase) => {
    clearScheduled();
    moveRef.current = null;
    positionRef.current = { ...START };
    devicesRef.current = { ...INITIAL_DEVICES };
    phaseRef.current = next;
    previousCompletedRef.current = 0;
    setPhase(next);
    setDevices({ ...INITIAL_DEVICES });
    setPosition({ ...START });
    setFacing(1);
    setWalking(false);
    setInteracting(false);
    setDisappearing(false);
    setTooltip(null);
    setTargetMarker(null);
    setToast(null);
  }, [clearScheduled]);

  const arrive = useCallback((action: TargetAction) => {
    if (phaseRef.current !== 'playing') return;
    setInteracting(true);
    if (action.kind === 'toggle') {
      schedule(() => {
        setDevices(prev => {
          const next = { ...prev, [action.id]: !prev[action.id] };
          devicesRef.current = next;
          return next;
        });
        play('toggle');
      }, 330);
      schedule(() => setInteracting(false), 780);
    } else if (action.kind === 'inspect') {
      schedule(() => {
        showToast(INSPECTIONS[action.id]);
        play('inspect');
      }, 250);
      schedule(() => setInteracting(false), 690);
    } else if (action.kind === 'exit') {
      schedule(() => {
        if (Object.values(devicesRef.current).some(Boolean)) {
          setInteracting(false);
          showToast('Сначала выключи все три устройства!');
          return;
        }
        phaseRef.current = 'exiting';
        setPhase('exiting');
        play('door');
        moveRef.current = { waypoints: [{ x: 1269, y: 655 }] };
        setInteracting(false);
        setWalking(true);
        schedule(() => setDisappearing(true), 610);
        schedule(() => {
          phaseRef.current = 'won';
          setPhase('won');
          play('success');
        }, 1670);
      }, 320);
    }
  }, [play, schedule, showToast]);
  useEffect(() => { onArrivalRef.current = arrive; }, [arrive]);

  // One animation loop with delta-time movement, independent of render frame rate.
  useEffect(() => {
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const delta = Math.min((now - last) / 1000, .05);
      last = now;
      const movement = moveRef.current;
      if (movement && movement.waypoints.length) {
        const current = positionRef.current;
        const dest = movement.waypoints[0];
        const dx = dest.x - current.x;
        const dy = dest.y - current.y;
        const distance = Math.hypot(dx, dy);
        const distanceToTravel = WALK_SPEED * delta;
        if (distance <= distanceToTravel + .4) {
          positionRef.current = dest;
          setPosition({ ...dest });
          movement.waypoints.shift();
          if (!movement.waypoints.length) {
            moveRef.current = null;
            setWalking(false);
            setTargetMarker(null);
            if (movement.action) onArrivalRef.current(movement.action);
          }
        } else {
          const next = { x: current.x + (dx / distance) * distanceToTravel, y: current.y + (dy / distance) * distanceToTravel };
          positionRef.current = next;
          setPosition(next);
          if (Math.abs(dx) > 1) setFacing(dx > 0 ? 1 : -1);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const walkTo = useCallback((destination: Position, action?: TargetAction) => {
    if (phaseRef.current !== 'playing') return;
    // Interrupting a previous interaction cancels its delayed button press.
    clearScheduled();
    setInteracting(false);
    const legalDestination = legalFloor(destination);
    moveRef.current = { waypoints: makePath(positionRef.current, legalDestination), action };
    setTargetMarker(legalDestination);
    setToast(null);
    setWalking(true);
    setTooltip(null);
    play('step');
  }, [clearScheduled, play]);

  const panTo = useCallback((sceneX: number) => {
    const viewport = viewportRef.current;
    if (!viewport || viewport.scrollWidth <= viewport.clientWidth) return;
    const contentX = sceneX / 1400 * (viewport.scrollWidth - 16);
    viewport.scrollTo({ left: contentX - viewport.clientWidth / 2, behavior: 'smooth' });
  }, []);

  const toggleDevice = useCallback((id: DeviceId) => {
    panTo(STATIONS[id].x);
    walkTo(STATIONS[id], { kind: 'toggle', id });
  }, [walkTo, panTo]);
  const inspect = useCallback((id: InspectId) => {
    panTo(STATIONS[id].x);
    walkTo(STATIONS[id], { kind: 'inspect', id });
  }, [walkTo, panTo]);
  const goToDoor = useCallback(() => {
    if (!Object.values(devicesRef.current).every(on => !on)) {
      showToast('Сначала выключи свет, чайник и вентилятор.');
      play('click');
      return;
    }
    panTo(STATIONS.exit.x);
    walkTo(STATIONS.exit, { kind: 'exit' });
  }, [play, showToast, walkTo, panTo]);

  const onHover = useCallback((label: string | null, x?: number, y?: number) => {
    if (!label || phaseRef.current !== 'playing') setTooltip(null);
    else setTooltip({ label, x: x ?? 700, y: y ?? 300 });
  }, []);

  const onSceneClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (phaseRef.current !== 'playing' || !svgRef.current) return;
    const matrix = svgRef.current.getScreenCTM();
    if (!matrix) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const scene = pt.matrixTransform(matrix.inverse());
    if (scene.y < 681) {
      showToast('Чтобы пройти, кликни по свободному полу.');
      return;
    }
    walkTo({ x: scene.x, y: scene.y });
  }, [showToast, walkTo]);

  useEffect(() => {
    const previous = previousCompletedRef.current;
    previousCompletedRef.current = completed;
    if (phase === 'playing' && completed === 3 && previous !== 3) {
      showToast('Отлично! Все приборы выключены. Теперь — к двери! ✨', 5000);
      play('success');
    }
  }, [completed, phase, play, showToast]);

  useEffect(() => () => clearScheduled(), [clearScheduled]);
  useEffect(() => {
    const id = window.requestAnimationFrame(() => panTo(phase === 'playing' ? START.x : 730));
    return () => window.cancelAnimationFrame(id);
  }, [phase, panTo]);
  const restart = useCallback(() => reset('playing'), [reset]);
  const home = useCallback(() => reset('home'), [reset]);
  const toggleSound = useCallback(() => setSoundOn(v => !v), []);

  const tooltipWidth = tooltip ? Math.max(176, tooltip.label.length * 9.8 + 34) : 0;
  const tooltipX = tooltip ? clamp(tooltip.x, tooltipWidth / 2 + 15, 1400 - tooltipWidth / 2 - 15) : 0;
  const tooltipY = tooltip ? Math.max(72, tooltip.y - 27) : 0;

  return (
    <div className="app-shell">
      <header className="page-header">
        <a className="app-logo" href="#game" onClick={e => { e.preventDefault(); home(); }} aria-label="На главную">
          <span className="logo-symbol">✦</span><span>little<em>home</em></span><span className="logo-period">.</span>
        </a>
        <div className="header-caption">Маленькие дела — большой уют <span>✺</span></div>
        <div className="header-pill"><span className="live-dot" /> ИНТЕРАКТИВНАЯ ИГРА</div>
      </header>

      <main id="game" className={`game-layout ${phase === 'home' || phase === 'won' ? 'game-layout--overlay' : ''}`}>
        {phase === 'playing' || phase === 'exiting' ? <GameUI
          devices={devices} soundOn={soundOn} onToggleSound={toggleSound}
          onRestart={restart} onHome={home}
          toast={toast} onSelectTask={toggleDevice} /> :
          <aside className="sidebar sidebar--intro">
            <div className="sidebar-intro-mark">✦</div>
            <span className="intro-side-top">A LITTLE HOME STORY</span>
            <h2>Дом начинается<br />с заботы.</h2>
            <p>Осмотрись, выключи приборы и отправляйся по делам с лёгким сердцем.</p>
            <div className="intro-side-divider" />
            <div className="side-mission-number"><strong>03</strong><span>маленьких<br />добрых дела</span></div>
            <div className="sidebar-footer">Сделано с <span>♥</span> для любителей уюта</div>
          </aside>}

        <section ref={viewportRef} className="stage-viewport" aria-label="Игровая кухня">
          <div className="stage" role="application" aria-label="Игра Свет погаси">
            <svg ref={svgRef} viewBox="0 0 1400 820" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="Уютная кухня с интерактивными электроприборами" onClick={onSceneClick}>
              <Kitchen lightOn={devices.light} doorUnlocked={completed === 3} exiting={phase === 'exiting'} onInspect={inspect} onHover={onHover} onDoor={goToDoor} />
              <Devices devices={devices} onToggle={toggleDevice} onHover={onHover} />
              {targetMarker && phase === 'playing' && <g className="floor-target" transform={`translate(${targetMarker.x} ${targetMarker.y})`} pointerEvents="none"><circle r="19" fill="none" stroke="#fffbe4" strokeWidth="3"/><circle r="7" fill="#fffbe4" opacity=".85" /></g>}
              <Character position={position} walking={walking} interacting={interacting} direction={facing} disappearing={disappearing} />
              {/* Lighting mask leaves the window luminous after the ceiling lamp switches off. */}
              <defs><mask id="nightMask"><rect width="1400" height="820" fill="white" /><rect x="82" y="146" width="242" height="232" rx="12" fill="black" /></mask></defs>
              <motion.rect width="1400" height="820" fill="#152638" mask="url(#nightMask)" pointerEvents="none"
                initial={false} animate={{ opacity: devices.light ? 0 : .37 }} transition={{ duration: .75 }} />
              {tooltip && phase === 'playing' && <g transform={`translate(${tooltipX} ${tooltipY})`} pointerEvents="none">
                <rect x={-tooltipWidth / 2} y="-32" width={tooltipWidth} height="37" rx="16" fill="#334f49" opacity=".96" />
                <path d="M-7 3L0 11L7 3" fill="#334f49" />
                <text y="-9" textAnchor="middle" fontFamily="Nunito, sans-serif" fontSize="17" fontWeight="800" fill="#fff8e8">{tooltip.label}</text>
              </g>}
            </svg>
            <AnimatePresence mode="wait">
              {phase === 'home' && <HomeOverlay key="home" onStart={restart} />}
              {phase === 'won' && <EndOverlay key="won" onRestart={restart} onHome={home} />}
            </AnimatePresence>
          </div>
        </section>
      </main>
      <footer className="page-footer"><span>✦ Выключи. Проверь. Улыбнись.</span><span>Маленькое приключение в твоём браузере</span><span>© littlehome · 2026</span></footer>
    </div>
  );
}
