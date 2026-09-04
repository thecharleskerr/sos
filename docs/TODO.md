# Owner tasks

The things only the site owner can do: accounts to open, secrets to set,
values to supply. Each item says where the value goes and what happens
once it is there. Nothing here needs a code change unless it says so.

Tick an item by deleting it. Keep this file short.

## Before the sites go live

- [ ] **Legal name and contact address.** Set `legalName` and
      `contactEmail` for both sites in `packages/ui/site.js`. The privacy
      policy names the data controller and the terms page shows a contact
      route only once these exist; until then both lines are omitted rather
      than guessed.
- [ ] **Cloudflare Pages projects.** One per site, from this repository,
      with the build commands and output directories in the README. Set the
      custom domains and turn on "Always use HTTPS". The `_headers` file in
      each `public/` folder carries the security headers and the cache
      rules, so nothing needs setting in the dashboard for those.
- [ ] **Awin secrets.** Add `AWIN_API_TOKEN` and `AWIN_PUBLISHER_ID` under
      the repository's Settings, Secrets and variables, Actions. The weekly
      refresh reads the confirmed feeds (Vodafone, Three, iD Mobile) and
      wraps every scraped plan link as an Awin deep link when the publisher
      id is present. Apply to the programmes listed by `awin` id in
      `packages/ui/networks.js`; a programme that has not accepted the site
      still tracks nothing, so keep `isAffiliate` honest.
- [ ] **Cloudflare deploy hooks.** Create a deploy hook for each Pages
      project and add them as `CF_DEPLOY_HOOK_SIMS` and
      `CF_DEPLOY_HOOK_PHONES` repository secrets. The daily integrity job
      calls them after it hides a dead or drifted deal.
- [ ] **Replace the sample deals.** `content/sims/deals.json` is placeholder
      data and `npm run verify` warns about it. The first weekly refresh
      pull request replaces it; merge that before anything is published.

## Search engines and answer engines

- [ ] **Google Search Console.** Add both domains as Domain properties
      (DNS TXT record) or as URL prefix properties using the meta tag. For
      the meta tag, set `GOOGLE_SITE_VERIFICATION` as a build environment
      variable in each Pages project; the head renders the tag when it is
      set. Then submit `/sitemap.xml` for each site and request indexing of
      the homepage. Check the Enhancements reports after a week: the pages
      carry Organization, WebSite, Article, FAQPage, BreadcrumbList,
      ItemList and Product structured data and any warning there is worth
      fixing.
- [ ] **Bing Webmaster Tools.** Either import the sites from Search Console
      (quickest) or verify with the meta tag by setting
      `BING_SITE_VERIFICATION` in each Pages build environment. Submit the
      sitemap. IndexNow is already wired: each site serves its key file from
      `public/` and the index-ping workflow submits changed URLs after a
      deploy, which reaches Bing, Yandex and the other IndexNow engines.
- [ ] **Cloudflare Web Analytics.** In the Cloudflare dashboard, Analytics
      and Logs, Web Analytics, add each site and copy its token. Set it as
      `CF_BEACON_TOKEN` in the Pages build environment for that site. The
      head then renders the cookieless beacon, the privacy page switches to
      the wording that describes it, and the content security policy in
      `_headers` already allows the script. Leave the "automatic setup"
      injection off, since the site adds the script itself.
- [ ] **Answer engines.** `/llms.txt` and `/llms-full.txt` are live on both
      sites. Nothing to submit; check after a month whether ChatGPT,
      Perplexity and Google AI Overviews cite the roaming, price rise and
      network pages when asked the questions those pages answer, and
      compare against Uswitch and MoneySavingExpert.

## The first weekly refresh

- [ ] **Confirm the scraper recipe URLs.** Every plan page URL in
      `packages/data/ingest/scrape/recipes.mjs` is marked
      `urlVerified: false` because it was written without a live fetch. Run
      `npm run refresh` locally once (it is a dry run outside Actions) or
      read the first weekly run's summary, and correct any recipe whose page
      returned no plans. Flip `urlVerified` as each one is confirmed.
- [ ] **Confirm the HotUKDeals RSS paths** in the same file. The
      `/rss/tag/sim-only` and `/rss/tag/mobile-phones` paths are unconfirmed;
      if they 404, the lead section of the weekly summary is simply empty.
- [ ] **Check the Awin deep links.** After the first refresh with
      `AWIN_PUBLISHER_ID` set, open two or three `awin1.com/cread.php` links
      from the proposed deals and confirm they land on the network's plan
      page. The daily integrity job follows them from then on.

## Research that needs a fresh search budget

The compliance tables are filled by search agents that read the networks'
own pages, and this session's search allowance ran out before the second,
independent check could run. The briefs are written and saved; a session
with search available (start a new one, or raise
`CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`) can run them as they stand.
Each fills a table entry, and a filled price rise entry releases that
network's feed deals into the next weekly pull request.

- [ ] **Price rises, second check.** VOXI, Tesco Mobile, Sky Mobile, Asda
      Mobile, Lycamobile, 1pMobile, spusu, Mozillion, Honest Mobile, Your
      Co-op Mobile, Utility Warehouse, Revolut, BT Mobile. The first round's
      findings and quotes sit as comments beside each `unverified` entry in
      `packages/compliance/price-rises.ts`, so a direct read of the page
      named there is enough to flip the entry.
- [ ] **EE fixed price plans.** EE's terms from 7 August 2025 give £2.50 a
      month on 31 March for plans not on a fixed price. Confirm what EE
      calls its fixed price plans and whether the handset airtime rise is
      the same figure.
- [ ] **Phones.** Google Pixel 10 family, Pixel 10a, Pixel 9a, Galaxy Z
      Flip7 FE and the Galaxy A series (A56, A36, A26, A17) have no
      verified UK price yet. Samsung's and Google's stated years of
      software updates are also unrecorded. iPhone 16e's status (still sold
      or replaced by the 17e) is unsettled.
- [ ] **eSIM and perks** for Ecotalk, Utility Warehouse, Revolut, iD
      Mobile (perks), Lebara (perks), Simp (perks), and a second check on
      the small networks entered from one agent's findings.
- [ ] **Student offers** for Talkmobile, 1pMobile, spusu and Your Co-op
      Mobile, and the actual Lebara student price (its page is rendered by
      script and the search index has only the title).
- [ ] **Coverage and outage guides.** One per host network (O2, Vodafone,
      Three, EE): the coverage checker URL, the status page URL and the
      complaint route need a live read before the guides are written.
