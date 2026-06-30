/**
 * Signature element: a circular progress ring showing the percentage of a
 * recipe's ingredients the user already has.
 *
 * Track: neutral-100. Progress arc: sage-500, rounded caps.
 * Percentage number centered inside in Fraunces / sage-600.
 *
 * size: 'sm' (recipe cards) | 'lg' (detail hero)
 */
const SIZES = {
  sm: { box: 56, stroke: 5, font: 'text-sm' },
  lg: { box: 104, stroke: 8, font: 'text-2xl' },
};

export default function MatchRing({ percentage = 0, size = 'sm' }) {
  const { box, stroke, font } = SIZES[size] || SIZES.sm;
  const radius = (box - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percentage));
  const offset = circumference - (clamped / 100) * circumference;
  const center = box / 2;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: box, height: box }}
      role="img"
      aria-label={`${clamped}% of ingredients available`}
    >
      <svg width={box} height={box} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#F0EFEC"
          strokeWidth={stroke}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#5C8F49"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <span
        className={`absolute font-display font-semibold text-sage-600 ${font}`}
      >
        {clamped}%
      </span>
    </div>
  );
}
