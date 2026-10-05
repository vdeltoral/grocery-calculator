# Grocery Deal Calculator

Mobile-first, single-page calculator for comparing grocery item prices by value per dollar (protein, calories, etc.). Pick an item, enter its price per lb, and see the break-even price for every other item in the same category.

Static page styled with the shared design system (`@vdeltoral/design-system`, installed from GitHub at a release tag). No backend. `pnpm build` copies the page and the design system's CSS and JS into `dist/`.

## Editing items

Add or edit categories/items in `conversions.json`. Each category has a `metric` (what's being compared) and a list of `items` with `value_per_lb` for that metric. Items are only compared within the same category.

## Develop

```
pnpm install
pnpm build
```

Move to a newer design system release by changing the tag in `package.json` and running `pnpm install`.

## Deploy

Live at https://grocery-calculator-vincent.pages.dev/. Deploy updates with:

```
source ~/.cloudflare/deltoral.env
pnpm build
pnpm dlx wrangler pages deploy dist --project-name=grocery-calculator-vincent
```

(Project is named `grocery-calculator-vincent` because the plain `grocery-calculator.pages.dev` subdomain is already taken by another Cloudflare account globally.)
