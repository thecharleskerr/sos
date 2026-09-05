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
    npm test                # ingest, ranking and integrity tests, runs in CI
    npm run refresh         # the weekly feed pull, dry run outside Actions
    npm run integrity       # the daily link, freshness and drift check
    npm run seo             # the built-page audit, runs in CI after the build

## The weekly cycle

packages/data/ingest/run.mjs pulls the Awin telco feeds, merges the rows the
scrapers in packages/data/ingest/scrape/ read from the networks' own plan
pages, and proposes the week's deals in a pull request. The "Scraper trial
run" workflow runs the scrapers alone for tuning; the "Page reads" workflow
reads the pages the compliance tables are waiting on and proposes them as
text for a person to fill in. packages/data/verify/integrity.mjs hides
dead, drifted or unverified deals every morning. packages/data/rules/ ranks
the picks; the rules are written out in its README. Roaming and the price
rise come from packages/compliance, never from the feed, and a network with
no verified price rise has its deals held back until someone fills the entry
with a source.

## Owner tasks

docs/TODO.md lists what only the owner can do: accounts, secrets, the legal
name, and the research that needs a fresh search budget. Add to it rather
than asking in chat when a task needs a value only the owner has.

## Still to build

- packages/compliance/price-rises.ts  Sixteen networks verified by two
  independent agents. Tesco Mobile (rise set per customer at the point of
  sale), Sky Mobile (may increase unless a fixed price was agreed), VOXI
  (nothing published) and Your Co-op (an inflation linked clause) cannot be
  printed in pounds and stay held. spusu and Revolut carry a one month
  notice clause on rolling plans, which the table has no type for; that
  labelling question is the owner's, in docs/TODO.md.
- packages/compliance/phones.ts  Fourteen phones with a maker's price. The
  Pixel 10 and 11 families, Pixel 9a, Galaxy Z Flip7 FE and Galaxy A56, A36
  and A26 are listed without one because their store pages render the
  price by script; each needs a direct page read.
- Coverage and outage guides, one per host network, once a live read of the
  checker and status pages is possible.
