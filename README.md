# Fridge-to-Recipe Matcher

Add what's in your fridge and instantly see which recipes you can cook right now. The app matches your ingredients against a recipe database, ranks recipes by how many ingredients you already have, highlights what's missing, and builds a shopping list for anything you still need.

Built with **React + Vite + Tailwind CSS** on the front end and **Node.js + Express + MongoDB Atlas** on the back end.

---

## Features

- **Virtual fridge** — add, remove, and clear the ingredients you have on hand; your fridge persists to your account.
- **Recipe matching** — every recipe is ranked by how much of it you can already make, shown with a signature circular match ring ("You have 4 of 6").
- **Smart ingredient matching** — fuzzy, case-insensitive matching with simple singular/plural handling, so `tomato` matches `cherry tomatoes`.
- **Browsing & filters** — filter by cuisine, dietary tags (vegetarian / vegan / gluten-free), and maximum prep time.
- **Recipe detail** — full ingredient list (with checkmarks for what you have), numbered instructions, prep/cook time, and servings.
- **Shopping lists** — generate a list of just the missing ingredients for a recipe, then check items off as you shop.
- **Saved recipes** — keep recipes to cook later with one tap of the heart.
- **Accounts** — JWT-based auth with registration, login, and a persistent per-user fridge.

---

## Design

A calm, appetite-friendly interface built on a strict **two-color palette**: **sage green** (the primary brand color) and **cream / warm beige** (the secondary accent), with neutral grays for all text and structure. Headings use the **Fraunces** serif; body text uses **Inter**. A single warm light theme is the entire identity — there is no dark mode.

---

## Project structure

```
fridge-recipe-matcher/
├── client/                 # React + Vite + Tailwind front end
│   ├── src/
│   │   ├── components/      # ui/ (Button, Chip, Card, MatchRing, Spinner, Skeleton) + layout/
│   │   ├── pages/           # Home, MyFridge, RecipeDetail, SavedRecipes, ShoppingList, ...
│   │   ├── context/         # AuthContext, FridgeContext
│   │   ├── hooks/           # useFridge, useRecipeMatch
│   │   ├── services/        # api.js (axios)
│   │   └── utils/           # matchCalculator.js
│   └── Dockerfile
├── server/                 # Express + Mongoose API
│   ├── config/             # db.js (MongoDB Atlas connection)
│   ├── models/             # User, Recipe, Fridge, ShoppingList
│   ├── routes/             # auth, recipe, fridge, shoppingList
│   ├── middleware/         # auth, errorHandler, rateLimiter
│   ├── utils/              # matchingEngine.js
│   ├── seed/               # seedRecipes.js (25 sample recipes)
│   └── Dockerfile
├── docker-compose.yml
└── .env.example
```

---

## Setup

### 1. Clone

```bash
git clone <your-repo-url>
cd fridge-recipe-matcher
```

### 2. Set up MongoDB Atlas

This app uses **MongoDB Atlas (cloud) exclusively** — there is no local MongoDB.

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Add a database user and allow your IP address (or `0.0.0.0/0` for development).
3. Copy the `mongodb+srv://...` connection string.

### 3. Environment variables

```bash
cp .env.example .env
```

Fill in at least `MONGODB_URI` and `JWT_SECRET`:

| Variable         | Description                                            |
| ---------------- | ------------------------------------------------------ |
| `NODE_ENV`       | `development` or `production`                          |
| `PORT`           | Server port (default `5000`)                           |
| `MONGODB_URI`    | Your MongoDB Atlas connection string (`mongodb+srv://`)|
| `CLIENT_URL`     | URL of the client, used for CORS                       |
| `JWT_SECRET`     | A long, random secret for signing tokens               |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d`                              |

> The server reads `.env` from the `server/` working directory. You can keep a single `.env` at the repo root and copy/symlink it into `server/`, or place one directly in `server/`.

### 4. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 5. Seed the recipe database (run once)

The app needs sample recipe data to be useful on first run. From the `server/` folder:

```bash
node seed/seedRecipes.js
# or: npm run seed
```

This inserts **25 sample recipes** across a range of cuisines so the matching feature works immediately.

### 6. Run in development

In two terminals:

```bash
# Terminal 1 — API
cd server && npm run dev

# Terminal 2 — client
cd client && npm run dev
```

The client runs on `http://localhost:5173` and proxies `/api` requests to the server on `http://localhost:5000`.

---

## Running with Docker

The compose file builds the **server** and **client** services only — MongoDB stays on Atlas.

```bash
# Provide MONGODB_URI and JWT_SECRET via your shell or a .env file
MONGODB_URI="mongodb+srv://..." JWT_SECRET="..." docker compose up --build
```

- Client (nginx): `http://localhost:8080`
- Server (API): `http://localhost:5000`

Remember to seed the database once against your Atlas cluster (step 5).

---

## API endpoints

| Method | Endpoint                              | Auth | Description                                            |
| ------ | ------------------------------------- | :--: | ------------------------------------------------------ |
| GET    | `/api/health`                         |  No  | Health check                                           |
| POST   | `/api/auth/register`                  |  No  | Create a user (and an empty fridge), returns a token   |
| POST   | `/api/auth/login`                     |  No  | Log in, returns a token                                |
| GET    | `/api/auth/me`                        | Yes  | Current user                                           |
| GET    | `/api/fridge`                         | Yes  | Get the user's fridge                                  |
| POST   | `/api/fridge/add`                     | Yes  | Add an ingredient `{ name }`                           |
| DELETE | `/api/fridge/:ingredientName`         | Yes  | Remove one ingredient                                  |
| DELETE | `/api/fridge`                         | Yes  | Clear the whole fridge                                 |
| GET    | `/api/recipe/match`                   | Yes  | Recipes ranked against the user's fridge               |
| GET    | `/api/recipe`                         |  No  | Public, paginated, filterable recipe list              |
| GET    | `/api/recipe/:id`                     |  No  | A single recipe with full instructions                 |
| GET    | `/api/recipe/saved`                   | Yes  | The user's saved recipes                               |
| POST   | `/api/recipe/:id/save`                | Yes  | Toggle a recipe in the user's saved list               |
| POST   | `/api/shopping-list/generate`         | Yes  | Build a list of missing items `{ recipeId }`           |
| GET    | `/api/shopping-list`                  | Yes  | The user's shopping lists, newest first                |
| PUT    | `/api/shopping-list/:id/item/:index`  | Yes  | Toggle one item's checked state                        |
| DELETE | `/api/shopping-list/:id`              | Yes  | Delete a shopping list                                 |

Query params for `/api/recipe` and `/api/recipe/match`: `cuisine`, `dietaryTags` (comma-separated), `maxPrepTime`. The browse endpoint also supports `page` and `limit`.

---

## How the matching algorithm works

In plain terms: for each recipe, the app looks at every ingredient the recipe needs and checks whether you have something in your fridge that matches it.

1. **Normalize** both your fridge items and the recipe's ingredients — lowercase, trim spaces, and strip a trailing "s" so singular and plural forms line up (`eggs` ↔ `egg`).
2. **Match** each recipe ingredient against your fridge using a two-way substring check. So fridge `tomato` will match recipe `cherry tomatoes`, and a more specific fridge item will still match a general recipe ingredient.
3. **Score** the recipe: `matchPercentage = matched ÷ total`. The app also records exactly which ingredients you have and which are missing.
4. **Rank** all recipes by match percentage (highest first). When two recipes tie, the one where you have more ingredients in absolute terms wins.

The missing ingredients from this same calculation are what feed the shopping-list generator.

---

## Screenshots

_Add screenshots here._

- **Home / match grid** — `docs/home.png`
- **My fridge** — `docs/fridge.png`
- **Recipe detail with match ring** — `docs/recipe.png`
- **Shopping list** — `docs/shopping-list.png`

---

## License

MIT
