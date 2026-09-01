/* Money is stored as numbers in pounds and formatted at the last moment.
   Whole pounds print without pence, everything else with two. */
export const gbp = (n) => `£${n % 1 === 0 ? n : n.toFixed(2)}`;
