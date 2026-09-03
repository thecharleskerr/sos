# How the weekly picks are chosen

The rules in `picks.mjs`, in words. They are deterministic: the same feed
always gives the same showcase.

Only deals that are complete compete. A deal is complete when the feed states
its price, upfront cost, term and all three allowances, and the network's
roaming and mid-contract price rise are verified in `packages/compliance`.
Anything else is held back and listed in the refresh summary.

## The picks, awarded in this order, one per deal

1. **Deal of the week.** The best value: gigabytes per pound of effective
   monthly cost, where the upfront cost is spread over the term and unlimited
   data is scored as 200GB. Must offer at least 5GB.
2. **Best for roaming.** EU roaming included with no daily charge, the highest
   fair-use cap first. A cap the network does not state ranks below any
   stated cap.
3. **Best unlimited data.** The cheapest unlimited-data plan by effective
   monthly cost.
4. **Cheapest this week.** The lowest effective monthly cost with at least
   5GB.
5. **Best short contract.** The cheapest rolling plan with at least 5GB.

A deal that would win two picks takes the first and the second goes to the
next in line. Ties break on lower effective monthly cost, then shorter term,
then the deal id, so the outcome never depends on feed order.

## The showcase

Every pick winner is in, then the rest of the twelve slots fill with the best
value of what remains, at most two non-pick deals per network. Deal of the
week leads the page.

## What the rules never do

They never invent a figure. The 200GB weight for unlimited is a ranking
device and does not reach the page. They never touch an EE listing, which is
hand-written or absent (hard rule 1). They never override a pick a person has
set on a hand-written listing.
