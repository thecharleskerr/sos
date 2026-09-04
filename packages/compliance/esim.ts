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
  /* The eight below were found by one agent on 2026-09-04 from each
     network's own pages and confirmed the same day by a second agent from
     a different page on each site, except Mozillion, where the second
     agent's search returned no eSIM page (single agent). The quotes:
     Talkmobile: "Once purchased, you'll receive a QR code via email ... They have instant delivery."
     Asda: "eSIM is now available on Asda Mobile, and customers can simply pick their plan and select eSIM at checkout."
     1pMobile: "With an eSIM, you can activate your mobile plan instantly, right from your phone settings."
     spusu: "spusu offers eSIM or physical SIM card options."
     Lycamobile: "You can activate the eSIM ... by either scanning a QR code or by entering an activation code online."
     Mozillion: "eSIMs are offered for all plans, subject to you having an eSIM compatible phone ... sent to you via email within 1 working day"
     Honest: "For new customers, eSIM delivery is instant via email with setup in five minutes"
     Your Co-op: "you activate the service by scanning a QR code, downloading an eSIM straight from your network provider, or entering activation details in your settings." */
  talkmobile: { network: 'talkmobile', offered: true, detail: 'Sent by QR code in an email straight after purchase.', source: 'https://talkmobile.co.uk/sim-only', checked: '2026-09-04', evidence: 'official-page' },
  asda: { network: 'asda', offered: true, detail: 'Chosen at checkout when picking a plan, and you can switch between a physical SIM and eSIM later.', source: 'https://mobile.asda.com/esim', checked: '2026-09-04', evidence: 'official-page' },
  onep: { network: 'onep', offered: true, detail: 'Activated by scanning a QR code in the phone settings, and it can run alongside a physical SIM for a second number.', source: 'https://www.1pmobile.com/eSIM', checked: '2026-09-04', evidence: 'official-page' },
  spusu: { network: 'spusu', offered: true, detail: 'Offered as an alternative to a physical SIM when you order.', source: 'https://www.spusu.co.uk/esim', checked: '2026-09-04', evidence: 'official-page' },
  lyca: { network: 'lyca', offered: true, detail: 'Activated by scanning a QR code or entering an activation code online, on UK and travel plans.', source: 'https://www.lycamobile.co.uk/en/esim/', checked: '2026-09-04', evidence: 'official-page' },
  mozillion: { network: 'mozillion', offered: true, detail: 'On every plan for an eSIM compatible phone, sent by email within one working day; a physical SIM can be chosen instead.', source: 'https://www.mozillion.com/resources/help/joining-and-setup/', checked: '2026-09-04', evidence: 'official-page' },
  honest: { network: 'honest', offered: true, detail: 'Delivered instantly by email for new customers, with setup in about five minutes in the app.', source: 'https://join.honestmobile.co.uk/esim', checked: '2026-09-04', evidence: 'official-page' },
  coop: { network: 'coop', offered: true, detail: 'Activated by scanning a QR code or entering the activation details in the phone settings.', source: 'https://broadband.yourcoop.coop/help-resources/e-sim-information/', checked: '2026-09-04', evidence: 'official-page' },
  /* Found by the second agent on 2026-09-04:
     Ecotalk: "Ecotalk sends your eSIM by email and you'll be up and running in minutes." and "You can scan the QR code and install it, or press and hold the QR code until 'Add eSIM' appears."
     Utility Warehouse: "Scan the QR code in the email using your phone's camera. Scanning will automatically open your phone's settings and install the eSIM." and "It can take up to four hours for your eSIM to fully activate after you've downloaded it."
     Revolut: "Revolut's eSIM can carry a mobile plan that allows unlimited UK data, calls, and texts ... Revolut Mobile is provided by Gigs, using the Vodafone network." One agent; no page found stating there is no physical SIM option. */
  ecotalk: { network: 'ecotalk', offered: true, detail: 'Sent by email as a QR code to scan, or press and hold, then activated through the account portal or by phone.', source: 'https://www.ecotalk.co.uk/faqs', checked: '2026-09-04', evidence: 'official-page' },
  uw: { network: 'uw', offered: true, detail: 'A QR code arrives by email within an hour of ordering; scanning it installs the eSIM, and full activation can take up to four hours.', source: 'https://help.uw.co.uk/article/mobile/eSIM/how-do-i-get-an-esim', checked: '2026-09-04', evidence: 'official-page' },
  revolut: { network: 'revolut', offered: true, detail: 'Delivered as an eSIM through the Revolut app, provided by Gigs on the Vodafone network. No physical SIM option was found stated.', source: 'https://www.revolut.com/news/revolut_to_launch_mobile_plans_in_a_direct_challenge_to_traditional_network_providers/', checked: '2026-09-04', evidence: 'official-page' },
  /* Klarna Mobile is waitlist only in the UK as of 2026-09-04, so there is
     nothing to record. BT Mobile's eSIM is business only per bt.com. */
  bt: unverified('bt'), klarna: unverified('klarna'),
};
export const getEsim = (key: string): NetworkEsim | null => esim[key] ?? null;
