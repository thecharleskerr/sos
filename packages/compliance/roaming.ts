/* UK EU roaming reference table.
 *
 * Hand-maintained. This is the reference we check deal data against, so the
 * rules that govern it are stricter than the rest of the codebase:
 *
 *   1. Every figure comes from the network's own official pages. Never a
 *      comparison site, never recalled knowledge.
 *   2. A value nobody official states is null. It is never estimated, never
 *      carried over from a sibling network, never inferred from the host
 *      network. null renders as "Not stated", which is honest and costs us
 *      nothing. A wrong cap published against a network's name costs us the
 *      affiliate relationship.
 *   3. Every entry carries the source URL and the date it was checked, in the
 *      comment above it and in the data itself.
 *
 * Figures describe the terms offered to someone buying the plan NOW. Where a
 * network's terms differ by plan start date, the note says which cohort.
 *
 * Field names deliberately match RoamingSchema in packages/data/schema.js so
 * a deal's roaming object and this table can be compared directly.
 */

export type RoamingEvidence = 'official-page' | 'official-pdf' | 'unverified';

export interface NetworkRoaming {
  /** Key into the networks map in packages/ui/networks.js. */
  network: string;
  /** Can the plan allowance be used in the EU with no extra daily fee? */
  euIncluded: boolean | null;
  /** Fair use data cap in GB while roaming in the EU. */
  euCapGB: number | null;
  /** How many destinations the Europe or EU roaming zone covers. */
  destinationCount: number | null;
  /** Daily roaming charge in pounds. null when there is no daily charge. */
  dailyChargeGBP: number | null;
  /** Is roaming beyond Europe included at no extra cost? */
  worldwideIncluded: boolean | null;
  /** One short sentence naming any exception worth stating. */
  note: string | null;
  /** The official URL the figures came from. */
  source: string | null;
  /** ISO date the source was last checked. */
  checked: string | null;
  /** How the figures were established. 'unverified' means we hold no figure. */
  evidence: RoamingEvidence;
}

export const roaming: Record<string, NetworkRoaming> = {};

/** Mirrors the get() helper in packages/ui/networks.js. */
export const getRoaming = (key: string): NetworkRoaming | null => roaming[key] ?? null;
