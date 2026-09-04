/* eSIM availability by network, from each network's own pages. Built from
 * the research behind the eSIM guide (checked 2026-09-02 by a writer and an
 * independent fact refuter), quotes kept beside each entry. Networks with
 * nothing found stay unverified. */

export interface NetworkEsim {
  network: string;
  /** true: the network offers eSIM on the plans it sells. false: its pages
   *  say it does not. null: not stated. */
  offered: boolean | null;
  /** One line in the network's own terms: which plans, and any limit. */
  detail: string | null;
  source: string | null;
  checked: string | null;
  evidence: 'official-page' | 'unverified';
}

const unverified = (network: string): NetworkEsim => ({ network, offered: null, detail: null, source: null, checked: null, evidence: 'unverified' });

export const esim: Record<string, NetworkEsim> = {
  /* "eSIMs are available for all O2's Big Bundle and rolling plan offers.
     You can order an eSIM online or from any of our O2 stores." */
  o2: { network: 'o2', offered: true, detail: 'On Big Bundle and rolling SIM only plans, ordered online or in an O2 store.', source: 'https://www.o2.co.uk/help/phones-and-devices/sims-and-numbers/esim', checked: '2026-09-02', evidence: 'official-page' },
  /* "All Vodafone's Pay monthly and Pay as you go SIM only plans come with an eSIM option" */
  vodafone: { network: 'vodafone', offered: true, detail: 'All pay monthly and pay as you go SIM only plans, chosen at checkout.', source: 'https://www.vodafone.co.uk/sim-only/esim', checked: '2026-09-02', evidence: 'official-page' },
  /* "Three offers 30-day, 12- and 24-month contracts on SIM Only, with the option to choose eSIM ... no price differences." */
  three: { network: 'three', offered: true, detail: 'On 30 day, 12 month and 24 month SIM only plans, at no price difference to a physical SIM.', source: 'https://www.three.co.uk/sim/esim', checked: '2026-09-02', evidence: 'official-page' },
  /* "When you order an EE SIM only plan with an eSIM, you can download it straight away through the EE app." */
  ee: { network: 'ee', offered: true, detail: 'Downloads through the EE app on a pay monthly SIM only plan, or by a QR code sent in the post.', source: 'https://ee.co.uk/help/mobile/getting-started/download-and-use-an-ee-esim', checked: '2026-09-02', evidence: 'official-page' },
  /* "Many phones support dual SIM, which means you can have one physical SIM and one (or more) eSIM profiles active at the same time." */
  smarty: { network: 'smarty', offered: true, detail: 'Choose eSIM at checkout as a new customer, or swap an existing physical SIM through the dashboard.', source: 'https://smarty.co.uk/esim', checked: '2026-09-02', evidence: 'official-page' },
  /* "giffgaff eSIMs are activated through the giffgaff app only." */
  giffgaff: { network: 'giffgaff', offered: true, detail: 'Activated through the giffgaff app only, with no price difference to a physical SIM.', source: 'https://help.giffgaff.com/en/articles/261570-switching-to-an-esim-with-giffgaff', checked: '2026-09-02', evidence: 'official-page' },
  /* "iD Mobile's eSIMs are for mobile use only, and aren't currently compatible with tablets and wearables" */
  idmobile: { network: 'idmobile', offered: true, detail: 'Sent by QR code in an email; phones only, not tablets or wearables.', source: 'https://www.idmobile.co.uk/esim', checked: '2026-09-02', evidence: 'official-page' },
  /* "If you're new to VOXI, just choose eSIM at the checkout when buying a plan. If you're an existing VOXI customer, you can swap from a physical SIM to eSIM" */
  voxi: { network: 'voxi', offered: true, detail: 'New customers choose eSIM at checkout; existing customers swap in account settings.', source: 'https://www.voxi.co.uk/help/products/how-to-get-esim', checked: '2026-09-02', evidence: 'official-page' },
  /* Lebara's eSIM help page confirms support and directs customers to contact support to request one. */
  lebara: { network: 'lebara', offered: true, detail: 'Supported; existing customers contact customer support to request one.', source: 'https://www.lebara.co.uk/en/help/esim.html', checked: '2026-09-02', evidence: 'official-page' },
  /* "If you're a new or upgrading customer buying an eSIM-only phone with a pay monthly plan, your eSIM will be provided via digital download. ... text SWAP to 23424" */
  tesco: { network: 'tesco', offered: true, detail: 'By digital download for new or upgrading pay monthly customers; existing customers on a physical SIM text SWAP to 23424.', source: 'https://www.tescomobile.com/help/device-help/esim', checked: '2026-09-02', evidence: 'official-page' },
  /* "Sky Mobile offers eSIMs on SIM-only plans across a range of compatible devices." */
  sky: { network: 'sky', offered: true, detail: 'On SIM only plans for compatible devices, installed by scanning a QR code from your Sky account.', source: 'https://www.sky.com/help/articles/esim-sky-mobile', checked: '2026-09-02', evidence: 'official-page' },
  /* "Unlimited UK eSIM with free global roaming from £10 monthly" */
  simp: { network: 'simp', offered: true, detail: 'eSIM only. Every plan activates by scanning a QR code in the Simp app; there is no physical SIM.', source: 'https://simpmobile.com/', checked: '2026-09-02', evidence: 'official-page' },
  talkmobile: unverified('talkmobile'), bt: unverified('bt'), asda: unverified('asda'), onep: unverified('onep'), spusu: unverified('spusu'),
  lyca: unverified('lyca'), mozillion: unverified('mozillion'), honest: unverified('honest'), revolut: unverified('revolut'), klarna: unverified('klarna'),
  uw: unverified('uw'), coop: unverified('coop'), ecotalk: unverified('ecotalk'),
};
export const getEsim = (key: string): NetworkEsim | null => esim[key] ?? null;
