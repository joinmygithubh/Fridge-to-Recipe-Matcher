import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Refrigerator, SlidersHorizontal } from 'lucide-react';
import { useFridge } from '@context/FridgeContext';
import { useRecipeMatch } from '@hooks/useRecipeMatch';
import RecipeCard from '@components/RecipeCard';
import Chip from '@components/ui/Chip';
import Button from '@components/ui/Button';
import { SkeletonGrid } from '@components/ui/Skeleton';

const CUISINES = [
  'Italian',
  'Indian',
  'Chinese',
  'Mexican',
  'Greek',
  'Thai',
  'Japanese',
  'Middle Eastern',
  'Mediterranean',
  'American',
];
const DIETARY = ['vegetarian', 'vegan', 'gluten-free'];

export default function Home() {
  const { fridgeItems } = useFridge();
  const [cuisine, setCuisine] = useState('');
  const [dietaryTags, setDietaryTags] = useState([]);
  const [maxPrepTime, setMaxPrepTime] = useState(60);

  const filters = useMemo(
    () => ({
      cuisine: cuisine || undefined,
      dietaryTags,
      maxPrepTime: maxPrepTime < 60 ? maxPrepTime : undefined,
    }),
    [cuisine, dietaryTags, maxPrepTime]
  );

  const { matchedRecipes, loading } = useRecipeMatch(filters);

  const toggleTag = (tag) =>
    setDietaryTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const fridgeEmpty = fridgeItems.length === 0;

  return (
    <div>
      {/* Header */}
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-neutral-900 sm:text-4xl">
          What can you cook?
        </h1>
        <p className="mt-1 text-neutral-600">
          {fridgeEmpty ? (
            <>Add ingredients to your fridge to get started.</>
          ) : (
            <>
              Ranked against the{' '}
              <Link to="/fridge" className="text-sage-600 underline">
                {fridgeItems.length} ingredient
                {fridgeItems.length === 1 ? '' : 's'}
              </Link>{' '}
              in your fridge.
            </>
          )}
        </p>
      </header>

      {fridgeEmpty ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white/60 px-6 py-20 text-center">
          <Refrigerator className="mx-auto mb-4 text-neutral-400" size={44} />
          <p className="mb-6 text-neutral-600">
            Your fridge is empty — add a few ingredients to see what you can cook.
          </p>
          <Link to="/fridge">
            <Button>Add ingredients</Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Filter bar */}
          <div className="mb-8 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-neutral-600">
              <SlidersHorizontal size={16} /> Filters
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {/* Cuisine */}
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Cuisine
                </label>
                <select
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="w-full rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-800 focus:border-sage-300 focus:outline-none focus:ring-2 focus:ring-sage-100"
                >
                  <option value="">All cuisines</option>
                  {CUISINES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Max prep time */}
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Max prep time: {maxPrepTime >= 60 ? 'any' : `${maxPrepTime} min`}
                </label>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={maxPrepTime}
                  onChange={(e) => setMaxPrepTime(Number(e.target.value))}
                  className="mt-3 w-full accent-sage-500"
                />
              </div>

              {/* Dietary */}
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Dietary
                </label>
                <div className="flex flex-wrap gap-2">
                  {DIETARY.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      active={dietaryTags.includes(tag)}
                      onClick={() => toggleTag(tag)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <SkeletonGrid count={10} />
          ) : matchedRecipes.length === 0 ? (
            <p className="py-16 text-center text-neutral-600">
              No recipes match these filters. Try widening your search.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {matchedRecipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
