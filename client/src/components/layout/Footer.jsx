import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const footerLinks = [
  { to: '/', label: 'Home' },
  { to: '/fridge', label: 'My fridge' },
  { to: '/saved', label: 'Saved' },
  { to: '/shopping-list', label: 'Shopping list' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-neutral-100 bg-cream-100">
      <div className="mx-auto w-full max-w-[1800px] px-4 py-10 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-100">
                <Leaf size={20} className="text-sage-600" />
              </span>
              <span className="font-display text-xl font-semibold text-sage-700">
                Fridge
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              Add what&apos;s in your fridge and discover the recipes you can
              cook right now — with less waste and less guesswork.
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-3">
            <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">
              Explore
            </span>
            {footerLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm text-neutral-600 transition-colors hover:text-sage-700"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 border-t border-neutral-200 pt-6 text-sm text-neutral-400 sm:flex-row sm:justify-between">
          <p>&copy; {year} Fridge. Cook with what you have.</p>
          <p>Made with fresh ingredients.</p>
        </div>
      </div>
    </footer>
  );
}
