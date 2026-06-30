import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@context/AuthContext';
import Button from '@components/ui/Button';
import Card from '@components/ui/Card';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setSubmitting(true);
    try {
      await register(form);
      toast.success('Your fridge is ready');
      navigate('/fridge', { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sage-100">
            <Leaf size={26} className="text-sage-600" />
          </span>
          <h1 className="font-display text-2xl font-semibold text-sage-700">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Start matching recipes to what&apos;s in your fridge.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-600">
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={onChange}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 focus:border-sage-300 focus:outline-none focus:ring-2 focus:ring-sage-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={onChange}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 focus:border-sage-300 focus:outline-none focus:ring-2 focus:ring-sage-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={form.password}
              onChange={onChange}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 focus:border-sage-300 focus:outline-none focus:ring-2 focus:ring-sage-100"
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-sage-600 hover:underline">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}
