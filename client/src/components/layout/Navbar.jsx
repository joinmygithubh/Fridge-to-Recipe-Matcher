import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Leaf, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@context/AuthContext';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/fridge', label: 'My fridge' },
  { to: '/saved', label: 'Saved' },
  { to: '/shopping-list', label: 'Shopping list' },
];

function navLinkClass({ isActive }) {
  return isActive
    ? 'text-sage-600 border-b-2 border-sage-500 pb-0.5'
    : 'text-neutral-600 hover:text-sage-700';
}

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const initials = (user?.name || 'U')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-100 bg-cream-50/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8 xl:px-12">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-100">
            <Leaf size={20} className="text-sage-600" />
          </span>
          <span className="font-display text-xl font-semibold text-sage-700">
            Fridge
          </span>
        </NavLink>

        {/* Desktop nav */}
        {isAuthenticated && (
          <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={navLinkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="hidden items-center gap-3 md:flex">
              <span
                title={user?.name}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-100 text-sm font-medium text-sage-700"
              >
                {initials}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-sage-700"
              >
                <LogOut size={16} /> Log out
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-4 text-sm font-medium md:flex">
              <NavLink to="/login" className="text-neutral-600 hover:text-sage-700">
                Log in
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-full bg-sage-500 px-5 py-2 text-white hover:bg-sage-600"
              >
                Sign up
              </NavLink>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            type="button"
            className="text-neutral-800 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile slide-down panel */}
      {open && (
        <div className="border-t border-neutral-100 bg-cream-50 px-4 py-4 sm:px-6 md:hidden">
          {isAuthenticated ? (
            <nav className="flex flex-col gap-4 text-sm font-medium">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    isActive ? 'text-sage-600' : 'text-neutral-600'
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-left text-neutral-600"
              >
                <LogOut size={16} /> Log out
              </button>
            </nav>
          ) : (
            <nav className="flex flex-col gap-4 text-sm font-medium">
              <NavLink to="/login" onClick={() => setOpen(false)} className="text-neutral-600">
                Log in
              </NavLink>
              <NavLink to="/register" onClick={() => setOpen(false)} className="text-sage-600">
                Sign up
              </NavLink>
            </nav>
          )}
        </div>
      )}
    </header>
  );
}
