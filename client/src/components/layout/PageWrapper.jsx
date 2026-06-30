import Navbar from './Navbar';
import Footer from './Footer';

/**
 * App shell: navbar + warm cream canvas + footer.
 * Uses a full-width, responsive content area with comfortable gutters that
 * scale up on larger screens, and keeps the footer pinned to the bottom.
 */
export default function PageWrapper({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-cream-50">
      <Navbar />
      <main className="mx-auto w-full max-w-[1800px] flex-1 px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
