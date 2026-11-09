import { motion } from 'motion/react';
import { memo } from 'react';
import type { InspectId } from '../types';

type Props = {
  lightOn: boolean;
  doorUnlocked: boolean;
  exiting: boolean;
  onInspect: (id: InspectId) => void;
  onHover: (label: string | null, x?: number, y?: number) => void;
  onDoor: () => void;
};

const tiles = Array.from({ length: 23 }, (_, i) => i);
const floorSlats = Array.from({ length: 13 }, (_, i) => i);
const backsplash = Array.from({ length: 9 }, (_, i) => i);

export const Kitchen = memo(function Kitchen({ lightOn, doorUnlocked, exiting, onInspect, onHover, onDoor }: Props) {
  const inspect = (id: InspectId, label: string, x: number, y: number) => ({
    role: 'button' as const,
    tabIndex: 0,
    'aria-label': `Осмотреть: ${label}`,
    className: 'interactive decorative',
    onClick: (e: React.MouseEvent<SVGGElement>) => { e.stopPropagation(); onInspect(id); },
    onKeyDown: (e: React.KeyboardEvent<SVGGElement>) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onInspect(id); } },
    onPointerEnter: () => onHover(`Осмотреть · ${label}`, x, y),
    onPointerLeave: () => onHover(null),
  });

  return (
    <>
      <defs>
        <linearGradient id="wallGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#f8f1e5" /><stop offset="100%" stopColor="#efdecb" /></linearGradient>
        <linearGradient id="floorGradient" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#d9a983" /><stop offset="100%" stopColor="#c08b66" /></linearGradient>
        <linearGradient id="counterGradient" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fffaf1" /><stop offset="100%" stopColor="#dfd2c2" /></linearGradient>
        <linearGradient id="fridgeGradient" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#c9dcd4" /><stop offset="50%" stopColor="#e5eee7" /><stop offset="100%" stopColor="#b3cfc3" /></linearGradient>
        <linearGradient id="cabGradient" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#a5c6aa" /><stop offset="100%" stopColor="#789f84" /></linearGradient>
        <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#a2d8e7" /><stop offset="100%" stopColor="#f1d8ab" /></linearGradient>
        <radialGradient id="lampGlow"><stop offset="0%" stopColor="#ffeda4" stopOpacity=".72" /><stop offset="65%" stopColor="#ffeab2" stopOpacity=".14" /><stop offset="100%" stopColor="#ffeab2" stopOpacity="0" /></radialGradient>
        <radialGradient id="windowLight"><stop stopColor="#fff5d7" stopOpacity=".55" /><stop offset="100%" stopColor="#fffbdf" stopOpacity="0" /></radialGradient>
        <pattern id="wallDots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.1" fill="#bbab99" opacity=".16" /></pattern>
        <pattern id="tilePattern" width="48" height="34" patternUnits="userSpaceOnUse"><rect width="48" height="34" fill="#f5e7d7"/><path d="M 0 0 H 48 V 34" fill="none" stroke="#e6d3c0" strokeWidth="1.6"/><path d="M24 0 V34" stroke="#ead9c6" strokeWidth=".55" opacity=".7"/></pattern>
        <filter id="dropShadow" x="-30%" y="-40%" width="170%" height="200%"><feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#534c3c" floodOpacity=".2"/></filter>
        <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="12"/></filter>
      </defs>

      {/* Wallpaper, trims and floor */}
      <rect width="1400" height="668" fill="url(#wallGradient)" />
      <rect width="1400" height="668" fill="url(#wallDots)" />
      <rect y="596" width="1400" height="18" fill="#b5ae9c" />
      <rect y="599" width="1400" height="8" fill="#fff6e6" />
      <rect y="614" width="1400" height="206" fill="url(#floorGradient)" />
      <path d="M0 614H1400 M0 679H1400 M0 758H1400" stroke="#986d52" strokeWidth="2" opacity=".24" />
      {floorSlats.map(i => <path key={i} d={`M${i * 123 - 45} 615L${i * 130 - 81} 820`} stroke="#986d52" strokeWidth="2" opacity=".23" />)}
      {tiles.map(i => <path key={i} d={`M${i * 95 - 40} 679l-25 80`} stroke="#fcddbc" strokeWidth="1.3" opacity=".22" />)}
      <path d="M0 660H1400" stroke="#77593f" strokeWidth="4" opacity=".08" />

      {/* Window with landscape */}
      <g filter="url(#dropShadow)">
        <rect x="72" y="137" width="259" height="251" rx="18" fill="#ecf2e4" stroke="#ede0c8" strokeWidth="9" />
        <rect x="91" y="156" width="221" height="213" rx="7" fill="url(#skyGradient)" />
        <path d="M91 304Q138 242 198 298T312 291V369H91Z" fill="#b5cdb1" />
        <path d="M91 333Q147 282 193 330T312 318V369H91Z" fill="#81ac97" />
        <path d="M91 357Q140 328 188 354T312 341V369H91Z" fill="#6d9e88" />
        <circle cx="259" cy="210" r="27" fill="#fff8d7" opacity=".9" />
        <path d="M201 155V369 M91 261H312" stroke="#fdfbf1" strokeWidth="12" />
        <path d="M77 144Q99 159 118 150L115 335Q91 359 75 326Z" fill="#d9a6a1" />
        <path d="M325 144Q303 159 284 150L287 335Q310 361 327 326Z" fill="#d9a6a1" />
        {[82,94,106,295,307,319].map(x => <path key={x} d={`M${x} 149V328`} stroke="#b77f82" strokeWidth="2" opacity=".5" />)}
        <path d="M65 139Q200 128 339 139" fill="none" stroke="#a7775b" strokeWidth="9" strokeLinecap="round" />
        <rect x="62" y="380" width="279" height="17" rx="7" fill="#f9f2e5" />
      </g>
      <ellipse cx="242" cy="459" rx="244" ry="188" fill="url(#windowLight)" />

      {/* Wall art and little clock */}
      <g transform="translate(1160 190)">
        <circle r="42" fill="#fff9e9" stroke="#d9b99a" strokeWidth="9" filter="url(#dropShadow)" />
        <circle r="30" fill="#f9efdf" stroke="#d3b8a4" strokeWidth="1" />
        {[0,90,180,270].map(a => <path key={a} d="M0-32V-26" stroke="#947c69" strokeWidth="3" transform={`rotate(${a})`} />)}
        <path d="M0 0V-20 M0 0L16 9" stroke="#8e8069" strokeWidth="4" strokeLinecap="round" />
        <circle r="4" fill="#a77c62" />
      </g>
      <g transform="translate(1230 102) rotate(6)">
        <rect width="110" height="68" rx="7" fill="#fdf8ea" stroke="#d1ab83" strokeWidth="8" filter="url(#dropShadow)" />
        <path d="M35 51Q50 8 78 42" fill="none" stroke="#94b89c" strokeWidth="5" />
        <circle cx="45" cy="30" r="13" fill="#e8b3a3" />
        <path d="M35 48L79 18" stroke="#9baf88" strokeWidth="4" />
      </g>

      {/* Ceiling light and gentle radiance */}
      <motion.ellipse cx="730" cy="319" rx="355" ry="310" fill="url(#lampGlow)" animate={{ opacity: lightOn ? 1 : 0 }} transition={{ duration: 0.55 }} />
      <path d="M730 0V151" stroke="#ae937a" strokeWidth="8" />
      <rect x="715" y="147" width="30" height="14" rx="6" fill="#ad8f74" />
      <path d="M682 171Q686 121 730 120Q776 121 782 171L804 211Q731 238 657 211Z" fill="#d8ae84" stroke="#ad8566" strokeWidth="4" filter="url(#dropShadow)" />
      <path d="M664 213Q731 240 798 213" fill="none" stroke="#fff4d8" strokeWidth="9" strokeLinecap="round" />
      <motion.ellipse cx="730" cy="215" rx="47" ry="10" fill="#fff7bf" animate={{ opacity: lightOn ? 1 : 0.15 }} transition={{ duration: 0.45 }} />

      {/* Tiled backsplash */}
      <rect x="349" y="365" width="782" height="171" rx="3" fill="url(#tilePattern)" />
      <rect x="349" y="365" width="782" height="9" fill="#d5c0a5" opacity=".7" />
      {backsplash.map(i => <circle key={i} cx={380 + i * 85} cy={456 + (i % 2) * 7} r="2.6" fill="#c3ad95" opacity=".24" />)}

      {/* Upper cabinets */}
      <g filter="url(#dropShadow)">
        <rect x="348" y="212" width="403" height="161" rx="9" fill="#79a086" stroke="#62836e" strokeWidth="6" />
        <rect x="360" y="224" width="123" height="136" rx="7" fill="url(#cabGradient)" stroke="#628b76" strokeWidth="3" />
        <rect x="490" y="224" width="122" height="136" rx="7" fill="url(#cabGradient)" stroke="#628b76" strokeWidth="3" />
        <rect x="619" y="224" width="120" height="136" rx="7" fill="url(#cabGradient)" stroke="#628b76" strokeWidth="3" />
        {[470,599,726].map(x => <rect key={x} x={x} y="279" width="5" height="31" rx="2.5" fill="#f7dec0" />)}
        <path d="M361 227H481 M491 227H609 M622 227H738" stroke="#c8e0c4" strokeWidth="5" opacity=".46" />
      </g>

      {/* Open display shelves + spice jars */}
      <g filter="url(#dropShadow)">
        <rect x="809" y="231" width="322" height="15" rx="6" fill="#b78562" />
        <rect x="809" y="321" width="322" height="15" rx="6" fill="#b78562" />
      </g>
      {[835,879,923,967].map((x, i) => <g key={x}>
        <rect x={x} y={277 - (i % 2) * 13} width="29" height={43 + (i % 2) * 13} rx="6" fill={['#f5c4a1', '#e5c6a0', '#b9ccb1', '#edd1b8'][i]} stroke="#d5b49a" strokeWidth="2" />
        <rect x={x - 2} y={269 - (i % 2) * 13} width="33" height="9" rx="3" fill="#c49b71" />
        <rect x={x + 5} y="293" width="18" height="10" rx="3" fill="#fff8dc" opacity=".75" />
      </g>)}
      <g transform="translate(1043 294)">
        <path d="M-25-1V-20Q-24-41-4-41Q21-41 22-18V0Q16 16-5 16Q-23 15-25-1Z" fill="#ecc1ad" />
        <path d="M21-24Q45-27 40-7Q37 4 22-1" fill="none" stroke="#ecc1ad" strokeWidth="7" />
        <path d="M-23-18H20" stroke="#f9e8dd" strokeWidth="4" />
      </g>
      <g transform="translate(1016 231)">
        <rect x="-5" y="-30" width="32" height="31" rx="4" fill="#c5a37b" />
        <path d="M11-26Q-6-56-13-70M11-28Q9-63 25-76M11-26Q26-50 43-54" fill="none" stroke="#689377" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="-13" cy="-70" rx="15" ry="7" transform="rotate(28 -13 -70)" fill="#80aa88" />
        <ellipse cx="25" cy="-76" rx="15" ry="8" transform="rotate(-34 25 -76)" fill="#7da98b" />
        <ellipse cx="43" cy="-54" rx="13" ry="7" transform="rotate(22 43 -54)" fill="#7da98b" />
      </g>

      {/* Hooks, spatulas, hanging utensils */}
      <path d="M512 381H708" stroke="#aa8d73" strokeWidth="5" strokeLinecap="round" />
      {[537,576,614,654,689].map(x => <g key={x}>
        <path d={`M${x} 382v15`} stroke="#99806e" strokeWidth="3" strokeLinecap="round" />
        <circle cx={x} cy="400" r="5" fill="none" stroke="#99806e" strokeWidth="2" />
      </g>)}
      <path d="M536 404v43m-8 2q8 9 16 0" fill="none" stroke="#ad9892" strokeWidth="6" strokeLinecap="round" />
      <path d="M575 404v51m-12-4q12 12 24 0Z" fill="#b6aaa0" stroke="#8d918a" strokeWidth="3" />
      <path d="M614 403v51M606 444v11m8-12v12m8-12v12" stroke="#ad9892" strokeWidth="5" strokeLinecap="round" />
      <path d="M654 405v50M643 446q11 16 22 0" fill="none" stroke="#ad9892" strokeWidth="5" strokeLinecap="round" />
      <path d="M689 405v49M679 448q10 12 20 0Z" fill="#c2b4a4" stroke="#97816a" strokeWidth="2" />

      {/* Countertop and base cabinets */}
      <rect x="344" y="546" width="793" height="132" rx="9" fill="#688971" />
      {[353,516,679,842,1005].map(x => <g key={x}>
        <rect x={x} y="556" width="154" height="114" rx="5" fill="url(#cabGradient)" stroke="#60826f" strokeWidth="4" />
        <path d={`M${x + 10} 562H${x + 143}`} stroke="#dce8cf" strokeWidth="3" opacity=".45" />
        <rect x={x + 68} y="568" width="28" height="6" rx="3" fill="#f7dfbb" />
      </g>)}
      <rect x="340" y="525" width="799" height="28" rx="10" fill="url(#counterGradient)" stroke="#d2c0ac" strokeWidth="2" filter="url(#dropShadow)" />
      <rect x="351" y="531" width="776" height="5" rx="2.5" fill="#fffef6" opacity=".9" />
      <path d="M346 556H1130" stroke="#557660" strokeWidth="4" opacity=".35" />
      <rect x="352" y="670" width="780" height="12" rx="3" fill="#64836d" />

      {/* Sink */}
      <g {...inspect('sink', 'раковину', 453, 476)}>
        <ellipse cx="454" cy="528" rx="76" ry="15" fill="#b4aaa0" />
        <ellipse cx="454" cy="527" rx="66" ry="11" fill="#8f9e9f" />
        <ellipse cx="454" cy="528" rx="53" ry="7" fill="#bec6c4" />
        <path d="M447 518v-33q1-16 18-16t18 16v15" fill="none" stroke="#8c9f9c" strokeWidth="12" strokeLinecap="round" />
        <path d="M447 487h34" stroke="#d9e3de" strokeWidth="4" />
        <rect x="484" y="500" width="26" height="7" rx="3" fill="#b2c6c0" />
        <circle cx="454" cy="529" r="5" fill="#738786" />
        <rect className="hover-outline" x="375" y="464" width="154" height="76" rx="19" fill="none" stroke="#f6d08c" strokeWidth="4" />
      </g>

      {/* Stove surface + oven */}
      <g {...inspect('pan', 'сковородку', 658, 468)}>
        <rect x="564" y="507" width="189" height="21" rx="8" fill="#46545a" />
        <ellipse cx="613" cy="515" rx="33" ry="9" fill="#202f35" stroke="#7b8280" strokeWidth="4" />
        <ellipse cx="712" cy="515" rx="30" ry="9" fill="#202f35" stroke="#7b8280" strokeWidth="4" />
        <ellipse cx="620" cy="504" rx="35" ry="10" fill="#505b5f" stroke="#232f30" strokeWidth="5" />
        <ellipse cx="620" cy="501" rx="27" ry="6" fill="#79817e" />
        <path d="M649 500L699 486" stroke="#4b5050" strokeWidth="12" strokeLinecap="round" />
        <path d="M650 496L698 483" stroke="#79817e" strokeWidth="3" strokeLinecap="round" />
        <rect className="hover-outline" x="558" y="476" width="204" height="61" rx="13" fill="none" stroke="#f6d08c" strokeWidth="4" />
      </g>
      <rect x="560" y="552" width="193" height="123" rx="5" fill="#d6d5c8" stroke="#94a69e" strokeWidth="6" />
      <rect x="574" y="588" width="164" height="70" rx="5" fill="#4e5c5c" stroke="#e5e2ce" strokeWidth="5" />
      <rect x="583" y="599" width="146" height="51" rx="3" fill="#384b4b" />
      <path d="M590 603H724" stroke="#a5bfc0" strokeWidth="3" opacity=".44" />
      {[593,628,663,698,729].map(x => <circle key={x} cx={x} cy="570" r="7" fill="#84948f" stroke="#f8f4e4" strokeWidth="2" />)}
      <rect x="600" y="592" width="112" height="5" rx="2.5" fill="#e7e1d6" />

      {/* Fridge */}
      <g {...inspect('fridge', 'холодильник', 211, 445)}>
        <rect x="94" y="396" width="224" height="283" rx="18" fill="url(#fridgeGradient)" stroke="#a1bbb1" strokeWidth="6" filter="url(#dropShadow)" />
        <path d="M95 497H316" stroke="#a8c4bb" strokeWidth="6" />
        <rect x="111" y="417" width="8" height="55" rx="4" fill="#ecf4e9" opacity=".75" />
        <rect x="285" y="438" width="12" height="44" rx="5" fill="#91a9a3" />
        <rect x="285" y="520" width="12" height="73" rx="5" fill="#91a9a3" />
        <rect x="140" y="434" width="60" height="44" rx="7" fill="#fff6db" transform="rotate(-8 140 434)" />
        <path d="M153 448l13 12 22-25" fill="none" stroke="#90a886" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="156" cy="432" r="7" fill="#d99085" />
        <rect x="218" y="545" width="54" height="60" rx="4" fill="#f2f2df" transform="rotate(5 218 545)" />
        <path d="M230 564h30m-31 10h26m-24 10h22" stroke="#c4a690" strokeWidth="3" />
        <circle cx="243" cy="540" r="7" fill="#90a890" />
        <rect x="107" y="663" width="199" height="11" rx="5" fill="#94afa3" />
        <rect className="hover-outline" x="85" y="385" width="243" height="303" rx="20" fill="none" stroke="#f6d08c" strokeWidth="5" />
      </g>

      {/* Plants, pretty things, cups and cookbook */}
      <g {...inspect('plant', 'базилик', 405, 437)}>
        <rect x="381" y="492" width="51" height="39" rx="7" fill="#dc9a7c" />
        <path d="M378 492h57" stroke="#eeb6a2" strokeWidth="8" strokeLinecap="round" />
        <path d="M404 494V443M402 473q-22-12-20-34M405 477q28-19 27-42" stroke="#619179" strokeWidth="5" fill="none" />
        <ellipse cx="384" cy="440" rx="16" ry="9" fill="#88ae85" transform="rotate(23 384 440)" />
        <ellipse cx="431" cy="437" rx="18" ry="9" fill="#719c7b" transform="rotate(-28 431 437)" />
        <ellipse cx="405" cy="445" rx="15" ry="9" fill="#9abb88" transform="rotate(-71 405 445)" />
        <rect className="hover-outline" x="369" y="418" width="75" height="119" rx="15" fill="none" stroke="#f6d08c" strokeWidth="4" />
      </g>
      <g {...inspect('mug', 'кружку', 928, 469)}>
        <path d="M892 490h54v27q0 15-26 15t-28-15Z" fill="#ebba9e" stroke="#ce9b80" strokeWidth="3" />
        <path d="M944 497q27-7 24 13-2 16-23 9" fill="none" stroke="#d5a38a" strokeWidth="7" />
        <path d="M905 501q10 10 21 0" fill="none" stroke="#fff3dd" strokeWidth="4" />
        <ellipse cx="919" cy="490" rx="27" ry="6" fill="#f8ddc4" />
        <rect className="hover-outline" x="885" y="476" width="90" height="61" rx="15" fill="none" stroke="#f6d08c" strokeWidth="4" />
      </g>
      <g {...inspect('book', 'книгу рецептов', 1000, 481)}>
        <path d="M962 518l13-52 70 18-13 48Z" fill="#b87367" stroke="#99534e" strokeWidth="3" />
        <path d="M969 514l12-40 58 15-11 38" fill="none" stroke="#eecab0" strokeWidth="2" />
        <circle cx="1002" cy="499" r="12" fill="#f5d3a6" />
        <path d="M992 500h20m-10-10v20" stroke="#b77762" strokeWidth="3" />
        <rect className="hover-outline" x="952" y="456" width="101" height="84" rx="10" fill="none" stroke="#f6d08c" strokeWidth="4" />
      </g>
      <g transform="translate(748 489)">
        <ellipse rx="20" ry="9" fill="#e6dfd0" />
        <rect x="-16" y="-25" width="33" height="24" rx="5" fill="#f5e8d4" />
        <path d="M-13-15H14" stroke="#d5bba3" strokeWidth="2" />
        <ellipse cy="-25" rx="17" ry="4" fill="#fff8e6" />
      </g>

      {/* Switch / Door are rendered over the counter-side wall */}
      <g className={`interactive door ${doorUnlocked ? 'door--unlocked' : 'door--locked'}`}
        role="button" tabIndex={0} aria-label={doorUnlocked ? 'Выйти из кухни' : 'Дверь заперта до выполнения всех задач'}
        onClick={e => { e.stopPropagation(); onDoor(); }}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onDoor(); } }}
        onPointerEnter={() => onHover(doorUnlocked ? 'Выйти из кухни' : 'Сначала выключи все приборы', 1268, 339)}
        onPointerLeave={() => onHover(null)}>
        <rect x="1190" y="286" width="159" height="399" rx="14" fill="#9f806b" stroke="#fff0d7" strokeWidth="13" filter="url(#dropShadow)" />
        <rect x="1205" y="299" width="128" height="371" rx="6" fill="#3e6159" />
        <motion.g animate={{ scaleX: exiting ? 0.1 : 1 }} transition={{ duration: 0.8, ease: 'easeInOut' }} style={{ transformOrigin: '1205px 484px' }}>
          <rect x="1206" y="302" width="127" height="367" rx="5" fill="#b88a66" stroke="#986b54" strokeWidth="5" />
          <rect x="1220" y="326" width="100" height="135" rx="5" fill="#c89a76" stroke="#e6b68e" strokeWidth="5" />
          <path d="M1229 337h81v113h-81Z" fill="#b78b6d" opacity=".35" />
          <rect x="1220" y="493" width="100" height="154" rx="5" fill="#c89a76" stroke="#e6b68e" strokeWidth="5" />
          <path d="M1229 504h81v131h-81Z" fill="#b78b6d" opacity=".35" />
          <circle cx="1311" cy="482" r="10" fill="#f9daa5" stroke="#c18c5a" strokeWidth="3" />
          <circle cx="1311" cy="482" r="3.5" fill="#fff5da" />
        </motion.g>
        {doorUnlocked && !exiting && <g className="door-sparkle" fill="#fbf0a8"><path d="M1271 266l5 12 12 5-12 5-5 12-5-12-12-5 12-5Z"/><circle cx="1323" cy="278" r="4" /></g>}
        <rect className="hover-outline" x="1180" y="281" width="177" height="409" rx="16" fill="none" stroke="#f6d08c" strokeWidth="5" />
      </g>
      <g transform="translate(1166 555)">
        <rect x="-17" y="-15" width="34" height="31" rx="5" fill="#f5e9d7" stroke="#d6c5ae" strokeWidth="3" />
        <circle cx="-7" cy="0" r="4" fill="#c7ad8f" /><circle cx="7" cy="0" r="4" fill="#c7ad8f" />
      </g>

      {/* Small woven rug / tiny pet-like decorative details */}
      <ellipse cx="780" cy="769" rx="221" ry="42" fill="#a76f5d" opacity=".20" />
      <ellipse cx="780" cy="760" rx="204" ry="36" fill="#e0b8a1" stroke="#f7e2d1" strokeWidth="7" />
      <ellipse cx="780" cy="760" rx="175" ry="24" fill="none" stroke="#f5dfc6" strokeWidth="3" strokeDasharray="17 9" opacity=".75" />
      {[0,1,2,3,4,5].map(i => <path key={i} d={`M${605 + i * 69} 785v10`} stroke="#eed0bd" strokeWidth="3" strokeLinecap="round" />)}
      <g transform="translate(348 696)">
        <ellipse cx="0" cy="5" rx="31" ry="7" fill="#865c49" opacity=".24" />
        <rect x="-24" y="-10" width="47" height="15" rx="5" fill="#b78965" />
        <path d="M-18-9v-31m36 31v-31" stroke="#977354" strokeWidth="7" strokeLinecap="round" />
        <ellipse cy="-41" rx="33" ry="12" fill="#d6ae83" stroke="#a87a5a" strokeWidth="3" />
      </g>
    </>
  );
});
