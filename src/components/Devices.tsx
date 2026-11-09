import { memo, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import type { DeviceId, DevicesState } from '../types';

type Props = {
  devices: DevicesState;
  onToggle: (id: DeviceId) => void;
  onHover: (label: string | null, x?: number, y?: number) => void;
};

type DeviceProps = {
  onToggle: (id: DeviceId) => void;
  onHover: (label: string | null, x?: number, y?: number) => void;
  on: boolean;
};

function interactionHandlers(id: DeviceId, on: boolean, onToggle: Props['onToggle'], onHover: Props['onHover'], x: number, y: number) {
  const names: Record<DeviceId, string> = { light: 'свет', kettle: 'чайник', fan: 'вентилятор' };
  const label = `${on ? 'Выключить' : 'Включить'} ${names[id]}`;
  return {
    role: 'button' as const,
    tabIndex: 0,
    'aria-label': label,
    className: 'interactive device',
    onPointerEnter: () => onHover(label, x, y),
    onPointerLeave: () => onHover(null),
    onClick: (e: React.MouseEvent<SVGGElement>) => { e.stopPropagation(); onToggle(id); },
    onKeyDown: (e: React.KeyboardEvent<SVGGElement>) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(id); } },
  };
}

function LightSwitch({ on, onToggle, onHover }: DeviceProps) {
  return (
    <g {...interactionHandlers('light', on, onToggle, onHover, 1162, 400)}>
      <rect x="1138" y="413" width="52" height="74" rx="10" fill="#d9bd9e" filter="url(#dropShadow)" />
      <rect x="1143" y="416" width="43" height="65" rx="8" fill="#faf1e0" stroke="#d2bba0" strokeWidth="3" />
      <rect x="1150" y="423" width="29" height="51" rx="5" fill="#d9cab5" />
      <motion.g animate={{ y: on ? 0 : 24 }} transition={{ type: 'spring', damping: 18, stiffness: 250 }}>
        <rect x="1153" y="424" width="23" height="25" rx="3" fill="#fffdf2" stroke="#bdab93" strokeWidth="2" />
      </motion.g>
      <path d="M1163 431v6" stroke="#b3a38d" strokeWidth="3" strokeLinecap="round" opacity={on ? 1 : .25} />
      <circle cx="1165" cy="466" r="2.5" fill={on ? '#eeaf72' : '#a5ae96'} />
      <rect className="hover-outline" x="1132" y="407" width="63" height="86" rx="12" fill="none" stroke="#f8cb85" strokeWidth="4" />
    </g>
  );
}

function Kettle({ on, onToggle, onHover }: DeviceProps) {
  return (
    <g {...interactionHandlers('kettle', on, onToggle, onHover, 824, 426)} className={`interactive device kettle-device ${on ? 'kettle-device--on' : ''}`}>
      <ellipse cx="819" cy="524" rx="59" ry="11" fill="#a49384" opacity=".35" />
      <rect x="769" y="518" width="103" height="10" rx="5" fill="#526b66" />
      <path d="M772 475Q769 448 798 443H837Q861 444 863 469L860 515Q820 529 779 516Z" fill="#f5eee2" stroke="#bdc5b9" strokeWidth="4" filter="url(#dropShadow)" />
      <path d="M774 471Q766 463 752 463L769 482Z" fill="#f5eee2" stroke="#bdc5b9" strokeWidth="3" />
      <path d="M861 468Q890 463 888 490Q885 511 862 505" stroke="#617f77" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M862 468Q890 463 888 490Q885 511 862 505" stroke="#b2c8bb" strokeWidth="6" fill="none" />
      <rect x="795" y="437" width="45" height="12" rx="5" fill="#607f79" />
      <rect x="808" y="427" width="19" height="11" rx="5" fill="#425f59" />
      <path d="M790 463v49" stroke="#fff" strokeWidth="5" opacity=".7" strokeLinecap="round" />
      <path d="M800 457Q835 450 848 463" fill="none" stroke="#fff" strokeWidth="3" opacity=".7" />
      {/* A tactile rocker button with two positions */}
      <rect x="830" y="483" width="24" height="24" rx="6" fill="#a4aca2" stroke="#657b73" strokeWidth="2" />
      <motion.g animate={{ y: on ? 0 : 5 }} transition={{ type: 'spring', stiffness: 270, damping: 22 }}>
        <rect x="833" y="486" width="18" height="12" rx="4" fill="#f7e2b6" stroke="#d2b184" strokeWidth="1.5" />
      </motion.g>
      <motion.circle cx="815" cy="501" r="5.5" fill="#f59f70" animate={{ opacity: on ? 1 : .12, fill: on ? '#f59f70' : '#aab2ac' }} transition={{ duration: .3 }} />
      {on && <ellipse cx="815" cy="501" rx="12" ry="10" fill="#ffb780" opacity=".20" filter="url(#softGlow)" />}
      <g className={`steam-group ${on ? 'steam-group--on' : 'steam-group--off'}`}>
        {[0,1,2].map(i => <path key={i} className="steam-wisp" style={{ animationDelay: `${i * -0.8}s` }}
          d={`M${758 + i * 13} ${454 - i * 9}q-12-14 2-27q14-15 1-28`} stroke="#fffef2" strokeWidth="7" strokeLinecap="round" fill="none" opacity=".65" />)}
      </g>
      <rect className="hover-outline" x="741" y="416" width="161" height="125" rx="18" fill="none" stroke="#f8cb85" strokeWidth="4" />
    </g>
  );
}

function Fan({ on, onToggle, onHover }: DeviceProps) {
  const rotorRef = useRef<SVGGElement>(null);
  const poweredRef = useRef(on);
  const velocityRef = useRef(on ? 950 : 0);
  const angleRef = useRef(0);

  useEffect(() => { poweredRef.current = on; }, [on]);

  useEffect(() => {
    let frame = 0;
    let previous = performance.now();
    const animate = (now: number) => {
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      const goal = poweredRef.current ? 950 : 0;
      // Exponential damping gives physically pleasing acceleration and slowdown.
      velocityRef.current += (goal - velocityRef.current) * (1 - Math.exp(-dt * (poweredRef.current ? 3.8 : 1.65)));
      if (Math.abs(velocityRef.current) < .18 && !poweredRef.current) velocityRef.current = 0;
      angleRef.current = (angleRef.current + velocityRef.current * dt) % 360;
      rotorRef.current?.setAttribute('transform', `rotate(${angleRef.current} 1069 457)`);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <g {...interactionHandlers('fan', on, onToggle, onHover, 1066, 382)}>
      <ellipse cx="1069" cy="527" rx="58" ry="9" fill="#9ba098" opacity=".35" />
      <rect x="1058" y="468" width="22" height="56" rx="10" fill="#84a5a3" stroke="#557a79" strokeWidth="3" />
      <ellipse cx="1069" cy="524" rx="50" ry="10" fill="#95b5ae" stroke="#577d7a" strokeWidth="3" />
      <ellipse cx="1069" cy="518" rx="34" ry="5" fill="#c5d9cc" />
      {/* Fan casing */}
      <circle cx="1069" cy="457" r="57" fill="#b9cfc5" stroke="#6d9289" strokeWidth="6" />
      <circle cx="1069" cy="457" r="50" fill="#ebf1e3" opacity=".88" />
      <g ref={rotorRef}>
        {[0,120,240].map(a => <path key={a} transform={`rotate(${a} 1069 457)`}
          d="M1068 455Q1040 446 1045 425Q1055 401 1083 418Q1093 437 1072 460Z" fill="#83a6a1" stroke="#668a83" strokeWidth="2.5" />)}
      </g>
      <circle cx="1069" cy="457" r="14" fill="#557c77" stroke="#d5e6d5" strokeWidth="4" />
      <circle cx="1069" cy="457" r="5" fill="#d9e9d6" />
      <circle cx="1069" cy="457" r="54" fill="none" stroke="#597e79" strokeWidth="4" />
      {[0,30,60,90,120,150].map(a => <path key={a} d="M1069 408v98" transform={`rotate(${a} 1069 457)`} stroke="#75978f" strokeWidth="1.7" opacity=".75" />)}
      <circle cx="1069" cy="457" r="52" fill="none" stroke="#cdded3" strokeWidth="3" />
      {/* Physical push button on the fan base */}
      <rect x="1052" y="503" width="34" height="18" rx="8" fill="#5c8079" stroke="#e1e9d9" strokeWidth="2" />
      <motion.g animate={{ x: on ? 0 : 19 }} transition={{ type: 'spring', damping: 20, stiffness: 230 }}>
        <circle cx="1060" cy="512" r="6" fill={on ? '#f7c083' : '#d3dacb'} />
      </motion.g>
      <motion.circle cx="1106" cy="421" r="5" fill="#f9b17c" animate={{ opacity: on ? 1 : .05 }} />
      <rect className="hover-outline" x="1005" y="390" width="126" height="151" rx="23" fill="none" stroke="#f8cb85" strokeWidth="4" />
    </g>
  );
}

export const Devices = memo(function Devices({ devices, onToggle, onHover }: Props) {
  return <>
    <LightSwitch on={devices.light} onToggle={onToggle} onHover={onHover} />
    <Kettle on={devices.kettle} onToggle={onToggle} onHover={onHover} />
    <Fan on={devices.fan} onToggle={onToggle} onHover={onHover} />
  </>;
});
