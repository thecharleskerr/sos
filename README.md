# Quidby

One static site, quidby.com. A weekly curated showcase of the best UK mobile
deals, refreshed every Monday at 08:00 London time, in sections: SIM only
under `/sims/` and phones under `/phones/`, with the network pages, the
roaming table, the price rise calculator and the guides shared between them.
The repository keeps its working name, SOS.

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
    npm run dev            # http://localhost:4321
    npm run build          # apps/quidby/dist
    npm run verify

## Deploying

One Cloudflare Pages project from this repository.

| | Quidby |
|---|---|
| Build command | `npm run build` |
| Output directory | `apps/quidby/dist` |
| Custom domain | quidby.com |

quidby.co.uk, saveonsims.co.uk and saveonsmartphones.co.uk are attached to
the same project and sent to quidby.com by a Cloudflare bulk redirect that
keeps the path. `apps/quidby/public/_redirects` then maps the paths that
moved when the two launch-era sites became sections (the old `/deals/`,
`/students/`, `/this-week/` and roaming guide paths).

## Repository secrets needed

`AWIN_API_TOKEN` and `AWIN_PUBLISHER_ID`, for the weekly feed pull, and
`CF_DEPLOY_HOOK`, for the daily integrity job's redeploy. Add them under
Settings, Secrets and variables, Actions. Do not commit them.

Three optional build-time variables go in the Cloudflare Pages project's
build environment rather than in the repository: `CF_BEACON_TOKEN` (Cloudflare
Web Analytics), `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION`. Each
tag is omitted until its value exists. The full list of owner tasks, with
where each value goes, is in [docs/TODO.md](docs/TODO.md).

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

## What the site serves

The front page with this week's picks from each section. `/sims/`: the
weekly SIM only picks, seven category pages beneath it, the student table
at `/sims/students/` and `/sims/this-week/` from the refresh's changelog.
`/phones/`: this week's phone deals and a page per tracked phone. Shared:
a page per network under `/networks/` built from the verified tables, the
head to heads under `/compare/`, the roaming table at `/roaming/`, the
`/price-rise-calculator/`, dated guides under `/blog/` (each tagged with
its section), `/how-we-pick-deals/`, `/about/`, the policies, the verified
tables as JSON under `/data/`, and `sitemap.xml`, `robots.txt`, `feed.xml`,
`llms.txt` and `llms-full.txt`.

Every page carries a canonical URL, Open Graph tags with a rendered social
image, and structured data; guides, network, category and phone pages add
FAQ and breadcrumb data. The font is self-hosted. `public/_headers` sets
the security headers Cloudflare Pages serves, with a content security
policy that allows no scripts; add `static.cloudflareinsights.com` to
`script-src` if Cloudflare Web Analytics is switched on, and mention it in
the privacy page.

After a push to main, `.github/workflows/index-ping.yml` builds the site
and submits every URL to IndexNow. The key file in `public/` is public by
design. Google does not use IndexNow; submit the sitemap once in Search
Console.

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
