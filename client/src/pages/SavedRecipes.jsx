import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { recipeApi } from '@services/api';
import { useAuth } from '@context/AuthContext';
import { useFridge } from '@context/FridgeContext';
import { calculateMatch } from '@utils/matchCalculator';
import RecipeCard from '@components/RecipeCard';
import Button from '@components/ui/Button';
import { SkeletonGrid } from '@components/ui/Skeleton';

export default function SavedRecipes() {
  const { setUser } = useAuth();
  const { fridgeItems } = useFridge();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { recipes: saved } = await recipeApi.saved();
      setRecipes(saved || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggle = async (recipeId) => {
    try {
      const { savedRecipes } = await recipeApi.toggleSave(recipeId);
      setUser((prev) => (prev ? { ...prev, savedRecipes } : prev));
      setRecipes((prev) => prev.filter((r) => r._id !== recipeId));
      toast('Removed from saved');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fridgeNames = fridgeItems.map((i) => i.name);

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-neutral-900">
          Saved recipes
        </h1>
        <p className="mt-1 text-neutral-600">
          Recipes you&apos;ve kept to cook later.
        </p>
      </header>

      {loading ? (
        <SkeletonGrid count={3} />
      ) : recipes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white/60 px-6 py-20 text-center">
          <Heart className="mx-auto mb-4 text-neutral-400" size={40} />
          <p className="mb-6 text-neutral-600">
            You haven&apos;t saved any recipes yet — tap the heart icon on a
            recipe to save it here.
          </p>
          <Link to="/">
            <Button>Browse recipes</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={{
                ...recipe,
                match: calculateMatch(fridgeNames, recipe),
              }}
              saved
              onToggleSave={handleToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
