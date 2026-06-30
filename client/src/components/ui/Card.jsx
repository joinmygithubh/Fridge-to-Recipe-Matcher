/**
 * Base card surface: white, soft border, generous rounding, light shadow only.
 */
export default function Card({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag
      className={`rounded-2xl border border-neutral-100 bg-white shadow-sm ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
