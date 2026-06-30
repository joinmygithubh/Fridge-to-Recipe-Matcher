import { useNavigate } from 'react-router-dom';
import { Clock, UtensilsCrossed, Heart } from 'lucide-react';
import Card from '@components/ui/Card';
import Chip from '@components/ui/Chip';
import MatchRing from '@components/ui/MatchRing';

/**
 * Recipe card used in the match grid (Home) and Saved recipes.
 *  - recipe: recipe object, optionally with a `match` field attached
 *  - showMatch: whether to render the MatchRing + "You have X of Y" line
 *  - saved / onToggleSave: optional heart toggle
 */
export default function RecipeCard({
  recipe,
  showMatch = true,
  saved = false,
  onToggleSave,
}) {
  const navigate = useNavigate();
  const match = recipe.match;
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <Card
      as="article"
      className="group flex cursor-pointer flex-col overflow-hidden transition-shadow hover:shadow-md"
      onClick={() => navigate(`/recipe/${recipe._id}`)}
    >
      {/* Image / placeholder */}
      <div className="relative h-44 w-full overflow-hidden bg-cream-100">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-cream-500">
            <UtensilsCrossed size={36} />
          </div>
        )}

        {showMatch && match && (
          <div className="absolute right-3 top-3 rounded-full bg-white/90 p-1 shadow-sm">
            <MatchRing percentage={match.matchPercentage} size="sm" />
          </div>
        )}

        {onToggleSave && (
          <button
            type="button"
            aria-label={saved ? 'Remove from saved' : 'Save recipe'}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(recipe._id);
            }}
            className="absolute left-3 top-3 rounded-full bg-white/90 p-2 shadow-sm hover:bg-white"
          >
            <Heart
              size={18}
              className={saved ? 'text-sage-500' : 'text-neutral-400'}
              fill={saved ? '#5C8F49' : 'none'}
            />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-neutral-900">
          {recipe.title}
        </h3>

        {showMatch && match && (
          <div className="flex items-baseline gap-2">
            <span className="font-medium text-neutral-800">
              You have {match.matchedCount} of {match.totalCount}
            </span>
            <span className="text-xs text-neutral-400">
              {match.matchPercentage}% match
            </span>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {recipe.cuisine && <Chip label={recipe.cuisine} tone="cream" />}
          {(recipe.dietaryTags || []).slice(0, 2).map((tag) => (
            <Chip key={tag} label={tag} tone="cream" />
          ))}
        </div>

        {/* Times */}
        <div className="mt-auto flex items-center gap-4 pt-1 text-sm text-neutral-600">
          <span className="flex items-center gap-1.5">
            <Clock size={15} /> {totalTime} min
          </span>
          <span className="capitalize text-neutral-400">{recipe.difficulty}</span>
        </div>
      </div>
    </Card>
  );
}
