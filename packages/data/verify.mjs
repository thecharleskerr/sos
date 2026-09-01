/* Validates every deal file against the schema and the compliance rules.
   Runs in CI on every pull request. A failure blocks the merge. */
import { readFileSync, existsSync } from 'node:fs';
import { DealSetSchema, checkTotals } from './schema.js';
import { networks } from '../ui/networks.js';
import { HEX, contrast } from '../ui/contrast.js';

const files = ['content/sims/deals.json', 'content/phones/deals.json'];
let failed = false;

for (const file of files) {
  if (!existsSync(file)) { console.log(`skip  ${file} (not present yet)`); continue; }

  /* Scoped to this file on purpose. A run-wide flag would suppress the ok line
     for every later file once any earlier one failed, so a passing file would
     silently print nothing and read as though it had been skipped. */
  let fileFailed = false;

  const parsed = DealSetSchema.safeParse(JSON.parse(readFileSync(file, 'utf8')));
  if (!parsed.success) {
    console.error(`FAIL  ${file}`);
    for (const issue of parsed.error.issues) {
      console.error(`      ${issue.path.join('.')}: ${issue.message}`);
    }
    failed = true;
    continue;
  }

  for (const deal of parsed.data.deals) {
    /* The schema only checks the key is a non-empty string. An unknown key
       used to pass verify and then crash the Astro build with a bare
       TypeError, which is exactly the wrong place for the weekly feed pull
       to find out about a new or misspelt network. */
    if (!(deal.network in networks)) {
      console.error(`FAIL  ${file} → ${deal.id}: network '${deal.network}' is not in packages/ui/networks.js. Add it there or correct the deal.`);
      fileFailed = true;
    }
    /* Hard rule 1: EE is never an affiliate listing. EE's terms ban their
       feed appearing in automated comparison tables and threaten immediate
       suspension, so an EE deal marked as affiliate is always wrong. */
    if (deal.network === 'ee' && deal.isAffiliate) {
      console.error(`FAIL  ${file} → ${deal.id}: an EE deal must carry isAffiliate: false. Hard rule 1 in CLAUDE.md.`);
      fileFailed = true;
    }
    if (!checkTotals(deal)) {
      console.error(`FAIL  ${file} → ${deal.id}: total contract cost does not match monthly price times term plus upfront. That is drip pricing.`);
      fileFailed = true;
    }
    /* Hard rule 2: the rise renders in pounds and pence, no exceptions. For
       'fixed' the schema already refuses a null amount, so that branch is
       belt and braces; for 'cpi' this is the live gate. */
    if (rise_needs_amount(deal.priceRise)) {
      console.error(`FAIL  ${file} → ${deal.id}: a ${deal.priceRise.type} price rise must state the amount in pounds and pence.`);
      fileFailed = true;
    }
  }

  if (fileFailed) { failed = true; continue; }

  console.log(`ok    ${file} (${parsed.data.deals.length} deals)`);

  /* Placeholder figures must never reach production unnoticed. The _note
     marker alone is not enough, because deleting the note would silence the
     guard while the figures stayed fake, so the deal ids are checked too.
     Warning only: the scaffold ships with sample data deliberately, and a
     blocking check would leave CI red on a clean checkout. */
  const sampleIds = parsed.data.deals.filter((d) => d.id.startsWith('sample-')).length;
  if (/\bsample\b/i.test(parsed.data._note ?? '') || sampleIds > 0) {
    console.warn(`WARN  ${file} carries sample data (${sampleIds} sample ids). Every figure in it is unverified and must not be published.`);
  }
}

function rise_needs_amount(p) {
  return (p.type === 'fixed' || p.type === 'cpi') && typeof p.amountGBP !== 'number';
}

/* The 4.5:1 contrast floor on network pills is an accessibility requirement,
   and partly a regulatory one for a comparison service, so it blocks the
   merge rather than warning. A brand colour swapped in without flipping
   pillText would otherwise ship a pill nobody can read. */
let pillsFailed = false;
for (const [key, net] of Object.entries(networks)) {
  /* Shorthand or malformed hex would silently produce a nonsense ratio, so
     the format is checked before the maths trusts it. */
  if (!HEX.test(net.colour) || !HEX.test(net.pillText)) {
    console.error(`FAIL  ${key}: colour '${net.colour}' / pillText '${net.pillText}' must be six-digit hex like #0019A5.`);
    pillsFailed = true;
    failed = true;
    continue;
  }
  const ratio = contrast(net.colour, net.pillText);
  if (ratio < 4.5) {
    console.error(`FAIL  ${key}: the ${net.name} pill is ${ratio.toFixed(2)}:1, below the 4.5:1 floor. Flip pillText to '#000000'.`);
    pillsFailed = true;
    failed = true;
  }
}
if (!pillsFailed) console.log(`ok    network pill contrast (${Object.keys(networks).length} networks, all at or above 4.5:1)`);

process.exit(failed ? 1 : 0);
