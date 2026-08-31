/* Validates every deal file against the schema and the totals rule.
   Runs in CI on every pull request. A failure blocks the merge. */
import { readFileSync, existsSync } from 'node:fs';
import { DealSetSchema, checkTotals } from './schema.js';
import { networks } from '../ui/networks.js';

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
    if (!checkTotals(deal)) {
      console.error(`FAIL  ${file} → ${deal.id}: total contract cost does not match monthly price times term plus upfront. That is drip pricing.`);
      fileFailed = true;
    }
    if (deal.priceRise.type === 'fixed' && deal.priceRise.amountGBP === null) {
      console.error(`FAIL  ${file} → ${deal.id}: price rise must be stated in pounds and pence.`);
      fileFailed = true;
    }
  }

  if (fileFailed) { failed = true; continue; }

  console.log(`ok    ${file} (${parsed.data.deals.length} deals)`);

  /* Placeholder figures must never reach production unnoticed. This warns and
     does not fail: the scaffold ships with sample data deliberately, so making
     it blocking would leave CI red on a clean checkout. */
  if (/\bsample\b/i.test(parsed.data._note ?? '')) {
    console.warn(`WARN  ${file} is marked as sample data. Every figure in it is unverified and must not be published.`);
  }
}

/* The 4.5:1 contrast floor on network pills is an accessibility requirement,
   and partly a regulatory one for a comparison service, so it blocks the
   merge rather than warning. A brand colour swapped in without flipping
   pillText would otherwise ship a pill nobody can read. */
const channel = (c) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
};
const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

let pillsFailed = false;
for (const [key, net] of Object.entries(networks)) {
  const ratio = contrast(net.colour, net.pillText);
  if (ratio < 4.5) {
    console.error(`FAIL  ${key}: the ${net.name} pill is ${ratio.toFixed(2)}:1, below the 4.5:1 floor. Flip pillText to '#000000'.`);
    pillsFailed = true;
    failed = true;
  }
}
if (!pillsFailed) console.log(`ok    network pill contrast (${Object.keys(networks).length} networks, all at or above 4.5:1)`);

process.exit(failed ? 1 : 0);
