import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Check, Trash2, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { shoppingApi } from '@services/api';
import Button from '@components/ui/Button';
import Card from '@components/ui/Card';
import Spinner from '@components/ui/Spinner';

export default function ShoppingList() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { shoppingLists } = await shoppingApi.list();
      setLists(shoppingLists || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleItem = async (listId, itemIndex) => {
    try {
      const { shoppingList } = await shoppingApi.toggleItem(listId, itemIndex);
      setLists((prev) =>
        prev.map((l) => (l._id === listId ? shoppingList : l))
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  const removeList = async (listId) => {
    try {
      await shoppingApi.remove(listId);
      setLists((prev) => prev.filter((l) => l._id !== listId));
      toast('List removed');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Remove checked items from view by deleting lists where all are checked, or
  // clearing checked items: here we simply re-toggle nothing — provide a button
  // that removes lists whose items are all checked.
  const clearChecked = async () => {
    const fullyChecked = lists.filter(
      (l) => l.items.length > 0 && l.items.every((i) => i.checked)
    );
    if (fullyChecked.length === 0) {
      toast('Check off all items in a list to clear it');
      return;
    }
    await Promise.all(fullyChecked.map((l) => shoppingApi.remove(l._id)));
    setLists((prev) =>
      prev.filter((l) => !fullyChecked.some((f) => f._id === l._id))
    );
    toast.success('Cleared completed lists');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size={36} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-neutral-900">
            Shopping list
          </h1>
          <p className="mt-1 text-neutral-600">
            The ingredients you still need for recipes you want to cook.
          </p>
        </div>
        {lists.length > 0 && (
          <Button variant="secondary" size="sm" onClick={clearChecked}>
            Clear checked items
          </Button>
        )}
      </header>

      {lists.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white/60 px-6 py-20 text-center">
          <ShoppingCart className="mx-auto mb-4 text-neutral-400" size={40} />
          <p className="mb-6 text-neutral-600">
            No shopping lists yet — generate one from a recipe you want to cook.
          </p>
          <Link to="/">
            <Button>Find a recipe</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {lists.map((list) => (
            <Card key={list._id} className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <Link
                  to={`/recipe/${list.recipeId?._id || list.recipeId}`}
                  className="font-display text-lg font-semibold text-sage-700 hover:underline"
                >
                  {list.recipeId?.title || 'Recipe'}
                </Link>
                <button
                  type="button"
                  aria-label="Delete list"
                  onClick={() => removeList(list._id)}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {list.items.length === 0 ? (
                <p className="text-sm text-neutral-500">
                  You already had everything for this recipe.
                </p>
              ) : (
                <ul className="space-y-1">
                  {list.items.map((item, idx) => (
                    <li key={`${item.name}-${idx}`}>
                      <button
                        type="button"
                        onClick={() => toggleItem(list._id, idx)}
                        className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-neutral-50"
                      >
                        <span
                          className={`flex h-5 w-5 flex-none items-center justify-center rounded-md border ${
                            item.checked
                              ? 'border-sage-500 bg-sage-500'
                              : 'border-neutral-300 bg-white'
                          }`}
                        >
                          {item.checked && (
                            <Check size={13} className="text-white" strokeWidth={3} />
                          )}
                        </span>
                        <span
                          className={
                            item.checked
                              ? 'text-neutral-400 line-through'
                              : 'text-neutral-800'
                          }
                        >
                          {[item.quantity, item.unit].filter(Boolean).join(' ')}{' '}
                          {item.name}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
