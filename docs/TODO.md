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

## Research that needs a direct page read

The compliance tables are filled by search agents reading the networks'
own pages, with a second agent checking each figure independently. Search
only returns snippets, so a few pages defeat it: ones that render the
figure by script, and ones whose wording conflicts with another page on
the same site. Each item below needs someone to open the page and read
it. The entry's comment in the table names the page and the quote found.

- [ ] **Price rise labelling for rolling plans with a notice clause.**
      spusu and Revolut Mobile state no scheduled rise but reserve the
      right to change prices on one month's notice with a free exit. The
      table only knows "fixed", "none" or unverified, and hard rule 2 only
      allows a pounds figure or "No price rise" on a card. Decide whether
      such plans should show "No price rise" (as SMARTY, 1pMobile and
      Ecotalk's rolling plans already do on the strength of their own
      promises) or a new wording, then add the type if needed. Until then
      their deals stay held.
- [ ] **Your Co-op Mobile.** Its live pricing page states a CPI plus 3.9%
      rise each 1 March, which Ofcom banned in new contracts from January
      2025 and which cannot be printed in pounds. Read the page and the
      current SIM only terms to see whether it still applies to plans sold
      now. Held until then.
- [ ] **Sky Mobile.** The contract says prices may increase during the
      minimum term unless a fixed price was agreed, and the clearest copy
      found was a 2019 PDF. Read the current Sky Mobile contract.
- [ ] **Tesco Mobile.** The rise is set per customer at the point of sale
      for non Clubcard Price deals, so a feed row cannot carry it. Decide
      whether to list only Clubcard Price deals (frozen for the term) if
      the feed can identify them.
- [ ] **Lycamobile, January 2027.** Its no price rise page is unconditional,
      but a 2023 post framed the pay monthly freeze as running "until at
      least 2026". Re-check the page in January 2027.
- [ ] **Phone prices.** The Pixel 10, 10 Pro, 10 Pro XL, 10 Pro Fold, 10a,
      the Pixel 11, 11 Pro and 11 Pro XL, the Pixel 9a (one snippet said
      £499 for 128GB), the Galaxy Z Flip7 FE and the Galaxy A56, A36 and
      A26 are all on sale in the UK with no verified price. Open each store
      page, read the price and base storage, and fill the entry. Google's
      update commitment page returned conflicting snippets (five against
      seven years), so read that too. iPhone 16e's status (still sold, or
      replaced by the 17e) needs the live buy page.
- [ ] **Lebara student offer.** The page exists but is script rendered;
      read it for the price and the claim route.
- [ ] **Coverage and outage guides.** One per host network (O2, Vodafone,
      Three, EE): the coverage checker URL, the status page URL and the
      complaint route need a live read before the guides are written.
