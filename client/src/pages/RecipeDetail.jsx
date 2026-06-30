import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, Plus, Heart, Clock, Users, ShoppingCart, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { recipeApi, shoppingApi } from '@services/api';
import { useFridge } from '@context/FridgeContext';
import { useAuth } from '@context/AuthContext';
import { calculateMatch } from '@utils/matchCalculator';
import Button from '@components/ui/Button';
import Chip from '@components/ui/Chip';
import MatchRing from '@components/ui/MatchRing';
import Spinner from '@components/ui/Spinner';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fridgeItems } = useFridge();
  const { user, setUser, isAuthenticated } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const saved = Boolean(
    user?.savedRecipes?.some((r) => String(r) === String(id))
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    recipeApi
      .getOne(id)
      .then(({ recipe: r }) => {
        if (active) setRecipe(r);
      })
      .catch((err) => {
        toast.error(err.message);
        navigate('/');
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size={36} />
      </div>
    );
  }

  if (!recipe) return null;

  const fridgeNames = fridgeItems.map((i) => i.name);
  const match = calculateMatch(fridgeNames, recipe);
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSaving(true);
    try {
      const { saved: nowSaved, savedRecipes } = await recipeApi.toggleSave(id);
      setUser((prev) => (prev ? { ...prev, savedRecipes } : prev));
      toast(nowSaved ? 'Saved to your recipes' : 'Removed from saved');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setGenerating(true);
    try {
      await shoppingApi.generate(id);
      toast.success('Shopping list ready');
      navigate('/shopping-list');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-neutral-600 hover:text-sage-700"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Hero */}
      <div className="mb-10 grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-cream-100">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="h-64 w-full object-cover sm:h-80"
            />
          ) : (
            <div className="flex h-64 items-center justify-center text-cream-500 sm:h-80">
              No image
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-3 flex flex-wrap gap-2">
            {recipe.cuisine && <Chip label={recipe.cuisine} tone="cream" />}
            {(recipe.dietaryTags || []).map((t) => (
              <Chip key={t} label={t} tone="cream" />
            ))}
          </div>

          <h1 className="font-display text-3xl font-semibold leading-tight text-neutral-900 sm:text-4xl">
            {recipe.title}
          </h1>
          {recipe.description && (
            <p className="mt-2 text-neutral-600">{recipe.description}</p>
          )}

          <div className="mt-5 flex items-center gap-6">
            <MatchRing percentage={match.matchPercentage} size="lg" />
            <div>
              <p className="font-display text-lg font-semibold text-neutral-900">
                You have {match.matchedCount} of {match.totalCount}
              </p>
              <p className="text-sm text-neutral-600">ingredients on hand</p>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-5 text-sm text-neutral-600">
            <span className="flex items-center gap-1.5">
              <Clock size={16} /> {totalTime} min
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={16} /> Serves {recipe.servings}
            </span>
            <span className="capitalize text-neutral-400">{recipe.difficulty}</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant={saved ? 'secondary' : 'primary'}
              onClick={handleSave}
              disabled={saving}
            >
              <Heart
                size={18}
                fill={saved ? '#5C8F49' : 'none'}
                className={saved ? 'text-sage-600' : ''}
              />
              {saved ? 'Saved' : 'Save recipe'}
            </Button>
            {match.missingIngredients.length > 0 && (
              <Button
                variant="secondary"
                onClick={handleGenerate}
                disabled={generating}
              >
                <ShoppingCart size={18} /> Generate shopping list
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Two columns */}
      <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
        {/* Ingredients */}
        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-sage-700">
            Ingredients
          </h2>
          <ul className="space-y-3">
            {recipe.ingredients.map((ing, idx) => {
              const have = match.matchedIngredients.includes(ing.name);
              return (
                <li key={`${ing.name}-${idx}`} className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 flex-none items-center justify-center rounded-full ${
                      have ? 'bg-sage-100' : 'bg-neutral-100'
                    }`}
                  >
                    {have ? (
                      <Check size={14} className="text-sage-500" strokeWidth={3} />
                    ) : (
                      <Plus size={14} className="text-neutral-400" strokeWidth={3} />
                    )}
                  </span>
                  <span className="text-neutral-800">
                    {[ing.quantity, ing.unit].filter(Boolean).join(' ')}{' '}
                    <span className={have ? '' : 'text-neutral-600'}>
                      {ing.name}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Instructions */}
        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-sage-700">
            Method
          </h2>
          <ol className="space-y-5">
            {recipe.instructions.map((step, idx) => (
              <li key={idx} className="flex gap-4">
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-sage-100 font-display text-sm font-semibold text-sage-700">
                  {idx + 1}
                </span>
                <p className="leading-relaxed text-neutral-800">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
