import Navbar from './Navbar';

/**
 * App shell: navbar + warm cream canvas with a centered, padded content column.
 */
export default function PageWrapper({ children }) {
  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
