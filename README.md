# Save on Sims / Save on Smartphones

Two static sites, one monorepo. A weekly curated showcase of the best UK
mobile deals, refreshed every Monday at 08:00 London time.

## Getting it onto GitHub

    cd sos
    git init
    git add .
    git commit -m "Initial scaffold"
    git branch -M main
    git remote add origin git@github.com:YOUR-USERNAME/sos.git
    git push -u origin main

Create the empty repo on GitHub first, private, with no README or .gitignore,
otherwise the first push will conflict.

## Running it

    npm install
    npm run dev:sims       # http://localhost:4321
    npm run dev:phones
    npm run build
    npm run verify

## Deploying

Two Cloudflare Pages projects from the same repository.

| | Save on Sims | Save on Smartphones |
|---|---|---|
| Build command | `npm run build -w @sos/sims` | `npm run build -w @sos/phones` |
| Output directory | `apps/sims/dist` | `apps/phones/dist` |
| Custom domain | saveonsims.co.uk | saveonsmartphones.co.uk |

## Repository secrets needed

`AWIN_API_TOKEN` and `AWIN_PUBLISHER_ID`, for the weekly feed pull. Add them
under Settings, Secrets and variables, Actions. Do not commit them.

## The sample data is not real

`content/sims/deals.json` contains placeholder figures so the scaffold
renders. Every number in it is unverified. Replace it with real Awin feed
output before this site is published anywhere.

## Known security advisories

`npm audit` reports advisories against Astro, esbuild and sharp. None is
reachable in a static build with our current code, and the upgrade is a two
major version jump, so we have deferred it deliberately rather than ignored
it. The reasoning, advisory by advisory, is in
[docs/astro-advisories.md](docs/astro-advisories.md). Read that before acting
on an audit result, and before the phones site starts rendering device images.

## How the automation is meant to behave

The weekly job proposes and the daily job disposes.

- **Weekly refresh**, Mondays 08:00 London. Pulls the feed, normalises it,
  validates it, then opens a pull request with a readable diff. It never
  deploys. Merging the PR is what publishes.
- **Daily integrity check**, every morning. Follows every affiliate link,
  flags anything that has vanished from the feed, diffs prices against the
  feed, and auto-hides anything expired or drifted. This one does deploy,
  because it can only ever remove things.

## The weekly cycle, in practice

    npm run refresh -- --fixture packages/data/test/fixtures/telco-feed.csv
    npm run refresh -- --dry-run        # real feed, writes nothing
    npm run integrity -- --dry-run      # links, freshness, drift, report only
    npm test                            # the pipeline's own tests

`packages/data/ingest/run.mjs` reads every telco feed the Awin account can
see, maps each row through `ingest/columns.json`, and turns it into a deal
with `ingest/normalise.mjs`. A row the feed does not fully state is dropped
with a reason. A deal on a network whose roaming or mid-contract price rise
is not yet verified in `packages/compliance` is held back, because the card
cannot print a blank there (hard rule 2). What is left is ranked by
`rules/picks.mjs` (the rules are written out in `rules/README.md`), and the
summary in the pull request lists what was proposed, what changed since last
week, what was held and why, and what was dropped and why.

`packages/data/verify/integrity.mjs` runs every morning: dead link, gone from
the feed, price or term moved, or not verified for fourteen days all take a
deal off the site by changing its status. It also compares each card's
roaming line with the verified roaming table and warns on any disagreement.

Two things unblock the feed on day one:

1. Add `AWIN_API_TOKEN` (the Create-a-Feed data feed API key) as a secret.
   The first summary lists every header the feeds actually use, so
   `ingest/columns.json` and the network aliases in `normalise.mjs` can be
   corrected once and then left alone.
2. Fill `packages/compliance/price-rises.ts`, one network at a time, with
   sources. Until a network has a verified entry, every one of its deals is
   held back and named in the summary.

Read `CLAUDE.md` before changing anything. It has the rules that matter.
