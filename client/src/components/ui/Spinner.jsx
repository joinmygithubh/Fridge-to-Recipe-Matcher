import { Loader2 } from 'lucide-react';

/**
 * Simple spinning loader in the brand sage tone.
 */
export default function Spinner({ size = 24, className = '' }) {
  return (
    <Loader2
      size={size}
      className={`animate-spin text-sage-500 ${className}`}
      strokeWidth={2.5}
    />
  );
}
