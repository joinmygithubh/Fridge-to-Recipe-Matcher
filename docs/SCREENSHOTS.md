# Screenshots guide

This folder holds the screenshots referenced in the main [README](../README.md).
Drop your own images here using the exact filenames below and they'll render
automatically in the README.

## What to capture

| Filename                  | View              | Suggested state to capture                                                            |
| ------------------------- | ----------------- | ------------------------------------------------------------------------------------- |
| `home.png`                | Home / match grid | A few ingredients in the fridge, so the grid shows match rings and "You have X of Y". |
| `fridge.png`              | My fridge         | Several ingredient chips added, with the add input visible.                           |
| `recipe.png`              | Recipe detail     | A recipe with a partial match, showing the large match ring and the ingredient list.  |
| `shopping-list.png`       | Shopping list     | A generated list with a couple of items checked off.                                  |
| `saved.png` *(optional)*  | Saved recipes     | One or two saved recipes in the grid.                                                  |
| `login.png` *(optional)*  | Login / Register  | The warm card-on-cream auth screen.                                                    |

## Tips for clean, consistent shots

- Capture at a **desktop width of ~1280px** so the grid shows 3 columns.
- Use a browser zoom of 100% and hide bookmarks/extensions bars for a clean frame.
- Seed the database first (`node server/seed/seedRecipes.js`) so the grid is full.
- Add a realistic fridge (e.g. `tomatoes`, `garlic`, `eggs`, `olive oil`, `basil`)
  so match percentages vary and the rings look meaningful.
- Export as **PNG**; keep each image under ~500 KB if you can (resize to ~1600px wide max).

## How they appear in the README

The README's "Screenshots" section links to these files. Once present, you can
embed them like:

```markdown
![Home / match grid](docs/home.png)
![Recipe detail](docs/recipe.png)
```
