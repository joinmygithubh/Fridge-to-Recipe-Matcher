import { useCallback, useEffect, useState } from 'react';
import { recipeApi } from '@services/api';
import { useFridge } from '@context/FridgeContext';
import { useAuth } from '@context/AuthContext';

/**
 * Fetches recipes ranked against the user's fridge.
 * Re-fetches automatically whenever the fridge contents change.
 *
 * @param {Object} filters - optional { cuisine, dietaryTags, maxPrepTime }
 */
export function useRecipeMatch(filters = {}) {
  const { fridgeItems } = useFridge();
  const { isAuthenticated } = useAuth();
  const [matchedRecipes, setMatchedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Serialize filters/fridge so the effect dependency is stable.
  const filterKey = JSON.stringify(filters);
  const fridgeKey = fridgeItems.map((i) => i.name).join('|');

  const refetch = useCallback(async () => {
    if (!isAuthenticated) {
      setMatchedRecipes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.cuisine) params.cuisine = filters.cuisine;
      if (filters.dietaryTags?.length) {
        params.dietaryTags = filters.dietaryTags.join(',');
      }
      if (filters.maxPrepTime) params.maxPrepTime = filters.maxPrepTime;

      const { recipes } = await recipeApi.match(params);
      setMatchedRecipes(recipes || []);
    } catch (err) {
      setError(err.message);
      setMatchedRecipes([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, filterKey, fridgeKey]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { matchedRecipes, loading, error, refetch };
}
