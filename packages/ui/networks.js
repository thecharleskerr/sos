/* Network reference data.
 *
 * Colour values come from the design handoff's reference/networks.json, which
 * is the single source for them. Correct that file and regenerate this one,
 * rather than editing colours here.
 *
 * WARNING: only Vodafone's red is confirmed against published brand guidance.
 * Every other hex is a best-reading approximation and must be replaced from
 * the network's own brand or press kit before launch. confirmed says which.
 *
 * hostNetwork is the underlying radio network, which is what actually
 * determines coverage, so MVNOs must always display it. 'direct' marks the
 * four networks that own their radio. null means we have not confirmed the
 * host, and the interface says so rather than guessing.
 *
 * pillText flips to ink where the network colour is too pale to pass 4.5:1
 * against white. Mozillion and Revolut Mobile are corrected here: the design
 * reference has them on white text at 3.39:1 and 4.43:1, which breaks its own
 * accessibility floor. Fix reference/networks.json upstream too.
 * npm run verify enforces the floor, so this cannot regress silently.
 *
 * awin is the Awin merchant profile id (ui.awin.com/merchant-profile/<id>),
 * checked 2026-09-02 against the profiles indexed on awin.com, or null where
 * no programme was found. affiliate follows it, except EE (hard rule 1) and
 * BT (closed to new customers). awinFeed is true only where the profile
 * states the advertiser is on Awin's enhanced telecomms feed; null means
 * unknown until the first real feed pull lists the account's feeds.
 *
 * inkClash marks brands in pure black, which is the house ink:
 * their flash takes a paper keyline and their pill drops its fill, so a black
 * editorial mark is never mistaken for a network's colour.
 */
export const networks = {
  o2:         { name: 'O2',                hostNetwork: 'direct',    colour: '#0019A5', pillText: '#FFFFFF', confirmed: false, affiliate: true, awin: 3235, awinFeed: null },
  vodafone:   { name: 'Vodafone',          hostNetwork: 'direct',    colour: '#E60000', pillText: '#FFFFFF', confirmed: true, affiliate: true, awin: 1257, awinFeed: true },
  three:      { name: 'Three',             hostNetwork: 'direct',    colour: '#000000', pillText: '#FFFFFF', confirmed: false, affiliate: true, inkClash: true, awin: 10210, awinFeed: true },
  ee:         { name: 'EE',                hostNetwork: 'direct',    colour: '#00B0B9', pillText: '#000000', confirmed: false, affiliate: false,
               note: 'Editorial listing only. EE affiliate terms prohibit comparison-table use of their feed.', awin: 31423, awinFeed: null },
  smarty:     { name: 'SMARTY',            hostNetwork: 'Three',     colour: '#FFE600', pillText: '#000000', confirmed: false, affiliate: true, awin: 10933, awinFeed: null },
  voxi:       { name: 'VOXI',              hostNetwork: 'Vodafone',  colour: '#FF4E6E', pillText: '#000000', confirmed: false, affiliate: true, awin: 10951, awinFeed: null },
  giffgaff:   { name: 'giffgaff',          hostNetwork: 'O2',        colour: '#000000', pillText: '#FFFFFF', confirmed: false, affiliate: true, inkClash: true, awin: 3599, awinFeed: null },
  idmobile:   { name: 'iD Mobile',         hostNetwork: 'Three',     colour: '#E5007D', pillText: '#FFFFFF', confirmed: false, affiliate: true, awin: 6366, awinFeed: true },
  tesco:      { name: 'Tesco Mobile',      hostNetwork: 'O2',        colour: '#00539F', pillText: '#FFFFFF', confirmed: false, affiliate: true, awin: 101917, awinFeed: null },
  lebara:     { name: 'Lebara',            hostNetwork: 'Vodafone',  colour: '#E4002B', pillText: '#FFFFFF', confirmed: false, affiliate: true, awin: 30681, awinFeed: null },
  talkmobile: { name: 'Talkmobile',        hostNetwork: 'Vodafone',  colour: '#6A2C8F', pillText: '#FFFFFF', confirmed: false, affiliate: true, awin: 2351, awinFeed: null },
  sky:        { name: 'Sky Mobile',        hostNetwork: 'O2',        colour: '#0072C9', pillText: '#FFFFFF', confirmed: false, affiliate: true, note: "On Awin under the general Sky programme (11005); whether it covers Sky Mobile is not stated in the profile snippet, so confirm before relying on it.", awin: 11005, awinFeed: null },
  bt:         { name: 'BT Mobile',         hostNetwork: 'EE',        colour: '#5514B4', pillText: '#FFFFFF', confirmed: false, affiliate: false,
                note: "Sold only to BT Broadband customers as a bundle since its relaunch (BT newsroom, checked 2026-09-04): four data tiers on 30 day terms, EU roaming included. Not open as a standalone plan, so no affiliate deals. BT's Awin programme (broadband, 3041) has tracked mobile at \u00a30 commission since April 2021.", awin: 3041, awinFeed: null },
  asda:       { name: 'Asda Mobile',       hostNetwork: 'Vodafone',  colour: '#78BE20', pillText: '#000000', confirmed: false, affiliate: true, awin: 6250, awinFeed: null },
  onep:       { name: '1pMobile',          hostNetwork: 'EE',        colour: '#00A0DF', pillText: '#000000', confirmed: false, affiliate: true, awin: 37738, awinFeed: null },
  spusu:      { name: 'spusu',             hostNetwork: 'EE',        colour: '#E2001A', pillText: '#FFFFFF', confirmed: false, affiliate: true,
                note: "On Awin (66040); the profile says applicants must submit a business case before approval.", awin: 66040, awinFeed: null },
  lyca:       { name: 'Lycamobile',        hostNetwork: 'EE',        colour: '#F58220', pillText: '#000000', confirmed: false, affiliate: true,
                note: "On Awin under two UK programmes (22905 and 128157). Lycamobile's current coverage and blog pages state it now uses EE, with O2 replaced. A legacy O2 page remains live, so re-check before relying on the host.", awin: 22905, awinFeed: null },
  mozillion:  { name: 'Mozillion',         hostNetwork: 'EE',        colour: '#1B9E77', pillText: '#000000', confirmed: false, affiliate: true,
                note: "On Awin (31539). Mozillion's own plan page states it uses EE. Quote verified 2026-09-01.", awin: 31539, awinFeed: null },
  simp:       { name: 'Simp',              hostNetwork: 'Three',        colour: '#F5D200', pillText: '#000000', confirmed: false, affiliate: false,
                note: "Live eSIM network at simpmobile.com, previously listed under a wrong domain. Its plans page states it runs on the Three network. No Awin programme found on 2026-09-02, so any listing is editorial.", awin: null, awinFeed: null },
  honest:     { name: 'Honest Mobile',     hostNetwork: 'Three',        colour: '#0F5132', pillText: '#FFFFFF', confirmed: false, affiliate: true,
                note: "On Awin (20890). Honest's plan page states it uses Three's masts. Quote verified 2026-09-01.", awin: 20890, awinFeed: null },
  revolut:    { name: 'Revolut Mobile',    hostNetwork: 'Vodafone',        colour: '#0075EB', pillText: '#000000', confirmed: false, affiliate: false,
                note: "No Awin programme found on 2026-09-02 (Revolut appears on Awin as a publisher, not an advertiser). Revolut's help centre states the plan is provided by Gigs on the Vodafone network. Quote verified 2026-09-01.", awin: null, awinFeed: null },
  klarna:     { name: 'Klarna Mobile',     hostNetwork: null,        colour: '#FFB3C7', pillText: '#000000', confirmed: false, affiliate: false,
                note: "No Awin programme found on 2026-09-02 (Klarna appears on Awin as a publisher, not an advertiser). Listed for completeness.", awin: null, awinFeed: null },
  uw:         { name: 'Utility Warehouse', hostNetwork: 'EE',        colour: '#003B71', pillText: '#FFFFFF', confirmed: false, affiliate: false,
                note: "No Awin programme found on 2026-09-02. UW's current network pages name EE as the host. Quote verified 2026-09-01.", awin: null, awinFeed: null },
  coop:       { name: 'Your Co-op Mobile', hostNetwork: 'EE',        colour: '#00B1E7', pillText: '#000000', confirmed: false, affiliate: true,
                note: "On Awin as Your Co-op Mobile & Broadband (30943). The co-op's help pages state the consumer service is carried on EE. Quote verified 2026-09-01.", awin: 30943, awinFeed: null },
  ecotalk:    { name: 'Ecotalk',           hostNetwork: null,        colour: '#4CAF50', pillText: '#000000', confirmed: false, affiliate: true,
                note: "On Awin (114718). Listed because readers ask what they charge.", awin: 114718, awinFeed: null },
};

export const get = (key) => networks[key] ?? null;

/** How a card describes where an MVNO actually runs. */
export const hostLabel = (net) => {
  if (!net) return null;
  if (net.hostNetwork === 'direct') return 'Direct from the network';
  if (net.hostNetwork === null) return 'Host network not confirmed';
  return `Runs on ${net.hostNetwork}`;
};
