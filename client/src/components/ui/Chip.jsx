import { X } from 'lucide-react';

/**
 * Reusable ingredient chip.
 *  - label: text to show
 *  - onRemove: optional callback; when provided, shows a small x button
 *  - tone: 'sage' (default ingredient chip) | 'cream' (tag/badge style)
 *  - active / onClick: for toggleable filter chips
 */
export default function Chip({
  label,
  onRemove,
  tone = 'sage',
  active = false,
  onClick,
  className = '',
}) {
  const tones = {
    sage: 'bg-sage-100 text-sage-700',
    cream: 'bg-cream-200 text-neutral-800',
  };

  const interactive = typeof onClick === 'function';
  const activeStyle = active
    ? 'bg-sage-500 text-white'
    : tones[tone] || tones.sage;

  const Wrapper = interactive ? 'button' : 'span';

  return (
    <Wrapper
      type={interactive ? 'button' : undefined}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
        interactive ? `transition-colors ${activeStyle}` : tones[tone] || tones.sage
      } ${className}`}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          aria-label={`Remove ${label}`}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="-mr-1 rounded-full p-0.5 text-sage-600 hover:bg-sage-200 hover:text-sage-700"
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      )}
    </Wrapper>
  );
}
