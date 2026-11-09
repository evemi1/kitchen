import { motion } from 'motion/react';
import type { Position } from '../types';

type Props = {
  position: Position;
  walking: boolean;
  interacting: boolean;
  direction: 1 | -1;
  disappearing: boolean;
};

export function Character({ position, walking, interacting, direction, disappearing }: Props) {
  return (
    <g transform={`translate(${position.x} ${position.y})`} className={`character ${walking ? 'character--walking' : ''} ${interacting ? 'character--interacting' : ''}`}>
      <motion.g animate={{ opacity: disappearing ? 0 : 1, scale: disappearing ? .6 : 1 }} transition={{ duration: .68 }} style={{ transformOrigin: '0px 0px' }}>
        <ellipse cx="0" cy="1" rx="28" ry="8" fill="#584737" opacity=".2" />
        <g className="avatar-bob">
          <g transform={`scale(${direction} 1)`}>
          {/* Legs swing gently from the hips. */}
          <g className="avatar-leg-left">
            <rect x="-21" y="-47" width="14" height="40" rx="7" fill="#526969" />
            <path d="M-23-10h19q7 4 2 10h-28q-4-7 7-10Z" fill="#72574e" />
            <path d="M-23-4h22" stroke="#cda68b" strokeWidth="3" />
          </g>
          <g className="avatar-leg-right">
            <rect x="6" y="-47" width="14" height="40" rx="7" fill="#526969" />
            <path d="M6-10h20q8 4 5 10H2Q-1-7 6-10Z" fill="#72574e" />
            <path d="M6-4h22" stroke="#cda68b" strokeWidth="3" />
          </g>
          {/* Overalls / top */}
          <path d="M-27-104Q-40-98-36-69L-26-37Q0-28 27-37L35-71Q39-97 23-105Z" fill="#f4b7a1" stroke="#c58c85" strokeWidth="3" />
          <path d="M-21-87L-18-43Q0-34 18-43L22-88" fill="#e18f7d" />
          <path d="M-14-77h27v21q-14 9-27 0Z" fill="#f0c3a1" />
          <path d="M-21-88l10 14m33-14-10 14" stroke="#e9cfb2" strokeWidth="6" strokeLinecap="round" />
          {/* Relaxed arms stay near the torso. Shoulder pivots are set in CSS. */}
          <g className="avatar-left-arm">
            <path d="M-29-93Q-36-89-36-75L-35-52" fill="none" stroke="#f4b7a1" strokeWidth="12" strokeLinecap="round" />
            <path d="M-29-93Q-36-91-36-83" fill="none" stroke="#e18f7d" strokeWidth="13" strokeLinecap="round" />
            <ellipse cx="-35" cy="-49" rx="7" ry="9" fill="#eebc9d" />
          </g>
          <g className="avatar-right-arm">
            <path d="M29-93Q36-89 36-75L35-52" fill="none" stroke="#f4b7a1" strokeWidth="12" strokeLinecap="round" />
            <path d="M29-93Q36-91 36-83" fill="none" stroke="#e18f7d" strokeWidth="13" strokeLinecap="round" />
            <ellipse cx="35" cy="-49" rx="7" ry="9" fill="#eebc9d" />
          </g>
          {/* Hair behind head */}
          <path d="M-37-123Q-48-160-30-174Q-8-193 19-181Q45-176 39-132L30-115Q0-104-37-123Z" fill="#655047" />
          <path d="M-32-152Q-39-122-25-116L-30-92Q-44-102-44-127" fill="#655047" />
          <path d="M26-145Q39-115 32-107L41-102Q52-142 31-166" fill="#655047" />
          {/* Head / face */}
          <ellipse cx="0" cy="-139" rx="34" ry="40" fill="#f5c4a5" stroke="#e0aa8f" strokeWidth="2.5" />
          <circle cx="-32" cy="-137" r="7" fill="#f4bfa0" />
          <circle cx="32" cy="-137" r="7" fill="#f4bfa0" />
          <ellipse cx="-15" cy="-130" rx="7" ry="4.5" fill="#e8a69c" opacity=".42" />
          <ellipse cx="17" cy="-130" rx="7" ry="4.5" fill="#e8a69c" opacity=".42" />
          <g className="avatar-eyes">
            <ellipse cx="-12" cy="-143" rx="3.1" ry="4.3" fill="#4f4c43" />
            <ellipse cx="12" cy="-143" rx="3.1" ry="4.3" fill="#4f4c43" />
          </g>
          <path d="M-6-126Q0-121 7-126" fill="none" stroke="#a56760" strokeWidth="2.7" strokeLinecap="round" />
          <path d="M-34-152Q-39-182-5-184Q23-193 36-167Q18-171 5-165Q-23-144-34-152Z" fill="#655047" />
          <path d="M-20-177Q-9-187 10-185" stroke="#96736a" strokeWidth="4" strokeLinecap="round" opacity=".7" />
          <path d="M-29-170Q-8-155 14-175" stroke="#655047" strokeWidth="13" strokeLinecap="round" />
          {/* A tiny yellow hair clip */}
          <path d="M-28-160l12-5" stroke="#ffd991" strokeWidth="5" strokeLinecap="round" />
          </g>
        </g>
      </motion.g>
    </g>
  );
}
