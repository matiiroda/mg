
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Tres anillos concéntricos dorados */}
    <circle cx="100" cy="100" r="92" stroke="#C5A059" strokeWidth="2.5" />
    <circle cx="100" cy="100" r="80" stroke="#C5A059" strokeWidth="1.5" />
    <circle cx="100" cy="100" r="74" stroke="#C5A059" strokeWidth="1" />
    
    {/* Caligrafía 'mg' con trazo fluido horizontal */}
    <g transform="translate(20, 75) scale(0.8)">
      {/* Trazo horizontal fluido que cruza el logo */}
      <path 
        d="M0 45 Q 40 40, 80 55 T 160 45 Q 185 40, 210 55" 
        stroke="#C5A059" 
        strokeWidth="4" 
        strokeLinecap="round" 
        fill="none" 
      />
      
      {/* Cursiva 'm' */}
      <path 
        d="M75 50 Q 85 25, 95 25 T 105 50 V 65 M105 50 Q 115 25, 125 25 T 135 50 V 70" 
        stroke="#C5A059" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none" 
      />
      
      {/* Cursiva 'g' */}
      <path 
        d="M135 50 Q 155 50, 155 70 T 135 90 T 115 70 M155 50 V 100 Q 155 125, 130 125 T 115 110" 
        stroke="#C5A059" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none" 
      />
    </g>
    
    {/* Efecto de resplandor sutil para dar el aspecto metálico de la imagen */}
    <defs>
      <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
  </svg>
);

export default Logo;
