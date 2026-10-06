import React from 'react';

export function IllustrativeImage({ type, className }: { type: string, className?: string }) {
  const commonProps = {
    className,
    viewBox: "0 0 64 64",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  };

  switch (type) {
    case 'resistor':
      return (
        <svg {...commonProps}>
          <rect x="12" y="24" width="40" height="16" rx="6" fill="#E2C296" />
          <path d="M0 32h12M52 32h12" stroke="#888" strokeWidth="4" />
          <rect x="18" y="24" width="4" height="16" fill="#D9381E" />
          <rect x="28" y="24" width="4" height="16" fill="#000" />
          <rect x="38" y="24" width="4" height="16" fill="#D9381E" />
          <rect x="46" y="24" width="2" height="16" fill="#D4AF37" />
        </svg>
      );
    case 'capacitor':
      return (
        <svg {...commonProps}>
          <circle cx="32" cy="24" r="16" fill="#E87A00" />
          <path d="M24 38v26M40 38v26" stroke="#888" strokeWidth="4" />
        </svg>
      );
    case 'capacitor_elec':
      return (
        <svg {...commonProps}>
          <rect x="16" y="10" width="32" height="34" rx="4" fill="#111" />
          <rect x="40" y="10" width="8" height="34" rx="2" fill="#CCC" />
          <path d="M42 20h4M42 24h4" stroke="#111" strokeWidth="2" />
          <path d="M24 44v20M40 44v14" stroke="#888" strokeWidth="4" />
        </svg>
      );
    case 'potentiometer':
      return (
        <svg {...commonProps}>
          <rect x="14" y="20" width="36" height="24" rx="2" fill="#333" />
          <circle cx="32" cy="32" r="10" fill="#CCC" />
          <path d="M32 32L26 26" stroke="#333" strokeWidth="3" strokeLinecap="round" />
          <path d="M20 44v12M32 44v12M44 44v12" stroke="#888" strokeWidth="4" />
        </svg>
      );
    case 'inductor':
      return (
        <svg {...commonProps}>
          <path d="M4 32h8" stroke="#888" strokeWidth="4" />
          <path d="M52 32h8" stroke="#888" strokeWidth="4" />
          <path d="M12 32a6 6 0 1 1 10 0 6 6 0 1 1 10 0 6 6 0 1 1 10 0 6 6 0 1 1 10 0" stroke="#B87333" strokeWidth="6" fill="none" />
        </svg>
      );
    case 'led':
      return (
        <svg {...commonProps}>
          <path d="M24 40v24M40 40v20" stroke="#888" strokeWidth="4" />
          <path d="M22 28v6h20v-6a10 10 0 0 0-20 0z" fill="#FF3333" opacity="0.9" />
          <circle cx="32" cy="18" r="10" fill="#FF3333" opacity="0.9" />
          <rect x="20" y="34" width="24" height="4" rx="1" fill="#CC0000" />
        </svg>
      );
    case 'lamp':
      return (
        <svg {...commonProps}>
          <circle cx="32" cy="24" r="18" fill="#FFD700" opacity="0.8" />
          <path d="M24 38l4 12h8l4-12" fill="#666" />
          <rect x="26" y="50" width="12" height="8" rx="2" fill="#444" />
          <path d="M28 58v6M36 58v6" stroke="#888" strokeWidth="4" />
        </svg>
      );
    case 'diode':
      return (
        <svg {...commonProps}>
          <rect x="16" y="24" width="32" height="16" rx="2" fill="#111" />
          <rect x="40" y="24" width="4" height="16" fill="#CCC" />
          <path d="M0 32h16M48 32h16" stroke="#888" strokeWidth="4" />
        </svg>
      );
    case 'powersupply':
      return (
        <svg {...commonProps}>
          <rect x="8" y="16" width="48" height="32" rx="4" fill="#DDD" />
          <rect x="12" y="20" width="24" height="12" rx="2" fill="#111" />
          <text x="24" y="30" fill="#0F0" fontSize="10" fontFamily="monospace" textAnchor="middle">5.0V</text>
          <circle cx="44" cy="26" r="4" fill="#333" />
          <circle cx="20" cy="40" r="3" fill="#F00" />
          <circle cx="30" cy="40" r="3" fill="#000" />
        </svg>
      );
    case 'battery':
      return (
        <svg {...commonProps}>
          <rect x="14" y="16" width="36" height="40" rx="4" fill="#222" />
          <rect x="14" y="16" width="36" height="12" rx="4" fill="#F9A826" />
          <path d="M20 16v-6h8v6M36 16v-6h8v6" fill="#CCC" />
          <path d="M24 6v4" stroke="#CCC" strokeWidth="2" />
        </svg>
      );
    case 'ac_source':
      return (
        <svg {...commonProps}>
          <circle cx="32" cy="32" r="24" fill="#E0E0E0" />
          <circle cx="24" cy="32" r="4" fill="#333" />
          <circle cx="40" cy="32" r="4" fill="#333" />
          <path d="M32 16v4" stroke="#333" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'ground':
      return (
        <svg {...commonProps}>
          <path d="M32 4v28" stroke="#22c55e" strokeWidth="4" />
          <path d="M16 32h32M22 40h20M28 48h8" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'switch':
      return (
        <svg {...commonProps}>
          <rect x="16" y="24" width="32" height="24" rx="4" fill="#333" />
          <circle cx="32" cy="24" r="12" fill="#E60000" />
          <path d="M20 48v16M44 48v16" stroke="#888" strokeWidth="4" />
        </svg>
      );
    case 'buzzer':
      return (
        <svg {...commonProps}>
          <circle cx="32" cy="28" r="20" fill="#111" />
          <circle cx="32" cy="28" r="6" fill="#333" />
          <path d="M24 44v20M40 44v20" stroke="#888" strokeWidth="4" />
        </svg>
      );
    case 'motor':
      return (
        <svg {...commonProps}>
          <rect x="16" y="16" width="32" height="32" rx="16" fill="#CCC" />
          <circle cx="32" cy="32" r="6" fill="#888" />
          <path d="M20 44v20M44 44v20" stroke="#B87333" strokeWidth="4" />
        </svg>
      );
    case 'protoboard':
      return (
        <svg {...commonProps}>
          <rect x="4" y="16" width="56" height="32" rx="4" fill="#F5F5F5" />
          <circle cx="12" cy="24" r="1.5" fill="#333" />
          <circle cx="20" cy="24" r="1.5" fill="#333" />
          <circle cx="28" cy="24" r="1.5" fill="#333" />
          <circle cx="36" cy="24" r="1.5" fill="#333" />
          <circle cx="44" cy="24" r="1.5" fill="#333" />
          <circle cx="52" cy="24" r="1.5" fill="#333" />
          <circle cx="12" cy="40" r="1.5" fill="#333" />
          <circle cx="20" cy="40" r="1.5" fill="#333" />
          <circle cx="28" cy="40" r="1.5" fill="#333" />
          <circle cx="36" cy="40" r="1.5" fill="#333" />
          <circle cx="44" cy="40" r="1.5" fill="#333" />
          <circle cx="52" cy="40" r="1.5" fill="#333" />
        </svg>
      );
    default:
      return null;
  }
}
