import { Link } from 'react-router-dom';
import Button from '@components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-display text-6xl font-semibold text-sage-300">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-neutral-900">
        Page not found
      </h1>
      <p className="mt-2 text-neutral-600">
        We couldn&apos;t find the page you were looking for.
      </p>
      <Link to="/" className="mt-6">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
