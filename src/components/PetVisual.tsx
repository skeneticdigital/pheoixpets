import type { PetKind } from '../data/content';

interface PetVisualProps {
  kind: PetKind;
  label?: string;
  file?: string;
  className?: string;
  showTag?: boolean;
}

const gradients: Record<PetKind, string> = {
  dog: 'from-gold/35 via-cream-deep to-clay/20',
  cat: 'from-sky-deep via-cream-soft to-gold/25',
  bird: 'from-clay/25 via-cream-soft to-sky/60',
};

const strokes: Record<PetKind, string> = {
  dog: '#C88A22',
  cat: '#3A352F',
  bird: '#D9662F',
};

// Simple line-art marks per species, standing in for real photography until
// final assets (see `file`) are dropped into src/assets/{dogs,cats,birds}/.
function Mark({ kind }: { kind: PetKind }) {
  const stroke = strokes[kind];
  if (kind === 'dog') {
    return (
      <svg viewBox="0 0 200 200" className="w-2/3 h-2/3" fill="none">
        <path
          d="M55 120c-8-22 2-46 20-58 6-16 22-27 40-27s34 11 40 27c18 12 28 36 20 58 4 14-2 30-16 38-10 20-32 32-44 32s-34-12-44-32c-14-8-20-24-16-38Z"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M60 62c-14-6-26-2-30 10-4 12 4 26 18 28" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M140 62c14-6 26-2 30 10 4 12-4 26-18 28" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="82" cy="108" r="4" fill={stroke} />
        <circle cx="118" cy="108" r="4" fill={stroke} />
        <path d="M92 128c4 5 12 5 16 0" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="100" cy="118" r="3.5" fill={stroke} />
      </svg>
    );
  }
  if (kind === 'cat') {
    return (
      <svg viewBox="0 0 200 200" className="w-2/3 h-2/3" fill="none">
        <path
          d="M62 60 42 24l34 20c8-3 16-4 24-4s16 1 24 4l34-20-20 36c16 12 26 32 26 54 0 40-38 60-64 60s-64-20-64-60c0-22 10-42 26-54Z"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <circle cx="82" cy="112" r="4" fill={stroke} />
        <circle cx="118" cy="112" r="4" fill={stroke} />
        <path d="M100 122v8" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M100 130c-6 6-16 8-24 4M100 130c6 6 16 8 24 4" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M60 118h-22M60 126h-24M140 118h22M140 126h24" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 200" className="w-2/3 h-2/3" fill="none">
      <path
        d="M70 150c-30 4-46-14-46-34 0-24 22-46 52-46 6-14 20-24 38-24 24 0 42 16 46 38 12 6 20 18 20 32 0 22-18 34-38 34"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M118 46c14-10 32-8 40 4" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="128" cy="66" r="4" fill={stroke} />
      <path d="M150 78c10-2 20 2 24 12" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <path d="M70 150c-4 14-2 28 6 34M96 154c0 14 4 26 12 32" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export default function PetVisual({ kind, label, file, className = '', showTag = true }: PetVisualProps) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${gradients[kind]} noise-overlay ${className}`}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-90">
        <Mark kind={kind} />
      </div>
      {showTag && (label || file) && (
        <div className="absolute left-4 bottom-4 right-4 flex items-end justify-between gap-2">
          {label && (
            <span className="font-display italic text-charcoal/70 text-sm md:text-base">{label}</span>
          )}
          {file && (
            <span className="font-utility text-[10px] tracking-wide text-charcoal/40 bg-cream/60 backdrop-blur-sm px-2 py-1 rounded-full">
              {file}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
