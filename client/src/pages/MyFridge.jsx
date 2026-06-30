import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Refrigerator } from 'lucide-react';
import { useFridge } from '@context/FridgeContext';
import Button from '@components/ui/Button';
import Chip from '@components/ui/Chip';
import Spinner from '@components/ui/Spinner';

export default function MyFridge() {
  const { fridgeItems, loading, addIngredient, removeIngredient, clearFridge } =
    useFridge();
  const [value, setValue] = useState('');
  const [confirmingClear, setConfirmingClear] = useState(false);
  const navigate = useNavigate();

  const handleAdd = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    addIngredient(value);
    setValue('');
  };

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-sage-700">
          Your fridge
        </h1>
        <p className="mt-1 text-neutral-600">
          Add what&apos;s in your fridge to see what you can cook right now.
        </p>
      </header>

      {/* Add ingredient */}
      <form onSubmit={handleAdd} className="mb-8 flex gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. tomatoes, garlic, eggs"
          className="flex-1 rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-neutral-800 placeholder:text-neutral-400 focus:border-sage-300 focus:outline-none focus:ring-2 focus:ring-sage-100"
        />
        <Button type="submit">
          <Plus size={18} /> Add
        </Button>
      </form>

      {/* Contents */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size={32} />
        </div>
      ) : fridgeItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white/60 px-6 py-16 text-center">
          <Refrigerator className="mx-auto mb-4 text-neutral-400" size={40} />
          <p className="text-neutral-600">
            Your fridge is empty — add a few ingredients to see what you can cook.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-4">
            {fridgeItems.map((item) => (
              <Chip
                key={item.name}
                label={item.name}
                onRemove={() => removeIngredient(item.name)}
              />
            ))}
          </div>

          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button onClick={() => navigate('/')}>Find recipes</Button>

            {confirmingClear ? (
              <div className="flex items-center gap-3 text-sm">
                <span className="text-neutral-600">Clear everything?</span>
                <button
                  type="button"
                  onClick={() => {
                    clearFridge();
                    setConfirmingClear(false);
                  }}
                  className="font-medium text-sage-700 underline"
                >
                  Yes, clear
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingClear(false)}
                  className="text-neutral-400"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingClear(true)}
                className="text-sm text-neutral-400 underline hover:text-neutral-600"
              >
                Clear fridge
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
