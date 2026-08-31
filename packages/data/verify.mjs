/* Validates every deal file against the schema and the totals rule.
   Runs in CI on every pull request. A failure blocks the merge. */
import { readFileSync, existsSync } from 'node:fs';
import { DealSetSchema, checkTotals } from './schema.js';

const files = ['content/sims/deals.json', 'content/phones/deals.json'];
let failed = false;

for (const file of files) {
  if (!existsSync(file)) { console.log(`skip  ${file} (not present yet)`); continue; }

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
      failed = true;
    }
    if (deal.priceRise.type === 'fixed' && deal.priceRise.amountGBP === null) {
      console.error(`FAIL  ${file} → ${deal.id}: price rise must be stated in pounds and pence.`);
      failed = true;
    }
  }

  if (!failed) console.log(`ok    ${file} (${parsed.data.deals.length} deals)`);
}

process.exit(failed ? 1 : 0);
