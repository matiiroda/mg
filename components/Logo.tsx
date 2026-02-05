
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="95" stroke="#C5A059" strokeWidth="1.5" opacity="0.6" />
    <circle cx="100" cy="100" r="82" stroke="#C5A059" strokeWidth="2" />
    <path d="M20 100 Q 60 90, 85 110 T 130 95 Q 160 90, 190 105" stroke="#C5A059" strokeWidth="3" fill="none" />
    <text x="50%" y="35" textAnchor="middle" fill="#C5A059" style={{ font: 'italic 18px serif', letterSpacing: '8px' }}>BEAUTY</text>
    <g transform="translate(75, 75) scale(0.8)">
      <path d="M15 45 Q 10 20, 30 20 T 45 45 V 70 M45 45 Q 50 20, 70 20 T 85 45 V 80 Q 85 100, 65 100 T 45 80" stroke="#C5A059" strokeWidth="5" strokeLinecap="round" fill="none" />
    </g>
  </svg>
);

export default Logo;
