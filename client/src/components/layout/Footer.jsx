import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

// Dummy restaurant locations. Each links out to Google Maps.
const locations = [
  { name: 'Fridge Kitchen — Downtown', address: '128 Maple Street, Springfield, IL 62701' },
  { name: 'Fridge Kitchen — Riverside', address: '47 Orchard Lane, Riverside, CA 92501' },
  { name: 'Fridge Kitchen — Harbour', address: '9 Seaview Walk, Brighton, BN1 2AB' },
];

const mapsUrl = (address) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-neutral-100 bg-cream-100">
      <div className="mx-auto w-full max-w-[1800px] px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
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
              <a
                key={loc.name}
                href={mapsUrl(loc.address)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-2 text-sm transition-colors hover:text-sage-700"
              >
                <MapPin size={16} className="mt-0.5 flex-none text-sage-500" />
                <span className="text-neutral-600">
                  <span className="font-medium text-neutral-800 group-hover:text-sage-700">
                    {loc.name}
                  </span>
                  <br />
                  {loc.address}
                  <span className="mt-0.5 flex items-center gap-1 text-xs text-sage-600">
                    View on map
                    <ExternalLink size={12} />
                  </span>
                </span>
              </a>
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
