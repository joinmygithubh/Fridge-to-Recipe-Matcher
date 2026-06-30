import { Link } from 'react-router-dom';
import { Leaf, MapPin, Phone, Mail } from 'lucide-react';

const footerLinks = [
  { to: '/', label: 'Home' },
  { to: '/fridge', label: 'My fridge' },
  { to: '/saved', label: 'Saved' },
  { to: '/shopping-list', label: 'Shopping list' },
];

// Dummy restaurant locations.
const locations = [
  { name: 'Fridge Kitchen — Downtown', address: '128 Maple Street, Springfield, IL 62701' },
  { name: 'Fridge Kitchen — Riverside', address: '47 Orchard Lane, Riverside, CA 92501' },
  { name: 'Fridge Kitchen — Harbour', address: '9 Seaview Walk, Brighton, BN1 2AB' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-neutral-100 bg-cream-100">
      <div className="mx-auto w-full max-w-[1800px] px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
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

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">
              Contact
            </span>
            <p className="flex items-start gap-2 text-sm text-neutral-600">
              <MapPin size={16} className="mt-0.5 flex-none text-sage-500" />
              <span>
                500 Greenmarket Avenue, Suite 200
                <br />
                Portland, OR 97204
              </span>
            </p>
            <a
              href="tel:+15035550199"
              className="flex items-center gap-2 text-sm text-neutral-600 transition-colors hover:text-sage-700"
            >
              <Phone size={16} className="flex-none text-sage-500" />
              +1 (503) 555-0199
            </a>
            <a
              href="mailto:hello@fridge.example"
              className="flex items-center gap-2 text-sm text-neutral-600 transition-colors hover:text-sage-700"
            >
              <Mail size={16} className="flex-none text-sage-500" />
              hello@fridge.example
            </a>
          </div>

          {/* Locations */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">
              Our kitchens
            </span>
            {locations.map((loc) => (
              <div key={loc.name} className="flex items-start gap-2 text-sm">
                <MapPin size={16} className="mt-0.5 flex-none text-sage-500" />
                <span className="text-neutral-600">
                  <span className="font-medium text-neutral-800">{loc.name}</span>
                  <br />
                  {loc.address}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 border-t border-neutral-200 pt-6 text-sm text-neutral-400 sm:flex-row sm:justify-between">
          <p>&copy; {year} Fridge. Cook with what you have.</p>
          <p>Made with fresh ingredients.</p>
        </div>
      </div>
    </footer>
  );
}
