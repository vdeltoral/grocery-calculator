# Grocery Deal Calculator

Mobile-first, single-page calculator for comparing grocery item prices by value per dollar (protein, calories, etc.). Pick an item, enter its price per lb, and see the break-even price for every other item in the same category.

No build step, no dependencies, no backend. It's a static `index.html` that fetches `conversions.json`.

## Editing items

Add or edit categories/items in `conversions.json`. Each category has a `metric` (what's being compared) and a list of `items` with `value_per_lb` for that metric. Items are only compared within the same category.

## Deploy

Live at https://grocery-calculator-vincent.pages.dev/. Deploy updates with:

```
source ~/.cloudflare/deltoral.env
npx wrangler pages deploy . --project-name=grocery-calculator-vincent
```

(Project is named `grocery-calculator-vincent` because the plain `grocery-calculator.pages.dev` subdomain is already taken by another Cloudflare account globally.)
