/* Validates every deal file against the schema and the totals rule.
   Runs in CI on every pull request. A failure blocks the merge. */
import { readFileSync, existsSync } from 'node:fs';
import { DealSetSchema, checkTotals } from './schema.js';

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

process.exit(failed ? 1 : 0);
