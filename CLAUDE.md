# Project SOS

Two Astro sites from one monorepo: Save on Sims (saveonsims.co.uk) and
Save on Smartphones (saveonsmartphones.co.uk). A curated weekly showcase of
the best UK mobile deals. No checkout. Revenue is affiliate only.

## Hard rules

1. Never place EE-branded deals into an automated comparison table sourced
   from EE's Awin feed. EE's terms ban it and threaten immediate suspension.
   Use EE-based MVNOs (1pMobile, Mozillion, Reward Mobile) or
   multi-network resellers. EE itself is listed with isAffiliate: false.
2. Every deal card must render: monthly price, total contract cost, the
   mid-contract price rise in pounds and pence (or "No price rise"), contract
   length, data, minutes, texts, roaming allowance and checked date. No
   exceptions, no tooltips, nothing below the fold.
3. Headline price is all-in. Never reveal a mandatory cost later. Drip
   pricing is banned under the DMCC Act 2024.
4. Deal data changes only via the weekly pull request. Never commit prices
   directly to content/ on a feature branch.
5. Never invent a price, allowance, roaming cap or commission figure. If a
   value is unknown the field is null and the UI shows "Not stated".

## Conventions

- British English everywhere: code comments, copy, commit messages.
- No em dashes in any user-facing copy. Use commas, colons or full stops.
- Money stored as numbers in pounds, formatted at render, never as strings.
- Tabular figures on every number in the UI.
- All deal data validated with zod before it reaches content/.
- Shared components live in packages/ui. If both sites need it, it goes there.

## Design

The house palette is monochrome: paper, ink, grey. All colour in the
interface comes from network brand identity, injected per card as --network.
Deal cards use the SIM card silhouette, one clipped corner top right, with
the network colour in that corner.

Never introduce a decorative gradient, a purple or blue house accent, a
coloured hero background, glassmorphism, or entrance animations on every
section. The only motion is the trace that draws around a button on hover
and focus, plus one settle on first load of the homepage.

## Commands

    npm install
    npm run dev:sims        # local dev, Save on Sims
    npm run dev:phones      # local dev, Save on Smartphones
    npm run build           # build both
    npm run verify          # schema and compliance checks, runs in CI

## Still to build

- packages/data/ingest/run.mjs      Awin Enhanced Telco Feed pull and normalise
- packages/data/verify/integrity.mjs Link health, expiry, price drift
- packages/data/rules/              Editorial ranking for the weekly picks
- packages/compliance/roaming.ts    Hand-maintained roaming reference table
- Category, network and guide pages
- JSON-LD, sitemaps, llms.txt
