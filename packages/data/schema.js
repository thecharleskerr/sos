import { z } from 'zod';

const allowance = z.union([z.number().nonnegative(), z.literal('unlimited')]);

export const RoamingSchema = z.object({
  euIncluded: z.boolean(),
  euCapGB: z.number().nullable(),
  destinationCount: z.number().nullable(),
  dailyChargeGBP: z.number().nullable(),
  worldwideIncluded: z.boolean(),
  note: z.string().nullable(),
});

export const PriceRiseSchema = z.object({
  type: z.enum(['none', 'fixed', 'cpi']),
  amountGBP: z.number().nullable(),
  month: z.string().nullable(),
  wording: z.string(),
}).refine(
  (p) => p.type !== 'fixed' || typeof p.amountGBP === 'number',
  { message: 'A fixed price rise must state the amount in pounds and pence. Ofcom requires cash terms.' }
);

export const DealSchema = z.object({
  id: z.string().min(1),
  site: z.enum(['sims', 'phones']),

  network: z.string().min(1),
  hostNetwork: z.string().min(1),
  merchant: z.string().min(1),

  monthlyPrice: z.number().nonnegative(),
  upfrontCost: z.number().nonnegative(),
  totalContractCost: z.number().nonnegative(),

  data: allowance,
  minutes: allowance,
  texts: allowance,
  contractLengthMonths: z.number().int().positive(),
  fiveG: z.boolean(),

  roaming: RoamingSchema,
  priceRise: PriceRiseSchema,

  device: z.object({
    name: z.string(),
    brand: z.string(),
    storageGB: z.number().int().positive(),
    colours: z.array(z.object({ name: z.string(), hex: z.string() })),
    imageUrl: z.string(),
    contractType: z.enum(['sim-free', 'contract']),
  }).optional(),

  url: z.string().url(),
  isAffiliate: z.boolean(),
  lastVerified: z.string(),
  feedLastUpdated: z.string(),

  pick: z.enum([
    'deal-of-week', 'best-roaming', 'best-unlimited',
    'cheapest', 'best-short-contract', 'best-for-students',
  ]).nullable(),
  status: z.enum(['live', 'stale', 'expired']),
});

export const DealSetSchema = z.object({
  _note: z.string().optional(),
  weekOf: z.string(),
  deals: z.array(DealSchema),
});

/** Total contract cost must equal what we display, or we are drip pricing. */
export function checkTotals(deal) {
  const expected = deal.monthlyPrice * deal.contractLengthMonths + deal.upfrontCost;
  return Math.abs(expected - deal.totalContractCost) < 0.01;
}
