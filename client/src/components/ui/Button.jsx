/**
 * Pill-shaped button in the app's two-color system.
 * variant: 'primary' (sage filled) | 'secondary' (sage outline) | 'ghost' (text)
 */
const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-body font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sage-300 focus:ring-offset-2 focus:ring-offset-cream-50 disabled:opacity-50 disabled:cursor-not-allowed';

const variants = {
  primary: 'bg-sage-500 hover:bg-sage-600 text-white',
  secondary:
    'border border-sage-300 text-sage-700 bg-transparent hover:bg-sage-50',
  ghost: 'text-neutral-600 hover:text-sage-700 hover:bg-sage-50',
};

const sizes = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={`${base} ${variants[variant] || variants.primary} ${
        sizes[size] || sizes.md
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
