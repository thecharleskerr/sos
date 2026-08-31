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
 * npm run verify enforces the floor, so this cannot regress silently. inkClash marks brands in pure black, which is the house ink:
 * their flash takes a paper keyline and their pill drops its fill, so a black
 * editorial mark is never mistaken for a network's colour.
 */
export const networks = {
  o2:         { name: 'O2',                hostNetwork: 'direct',    colour: '#0019A5', pillText: '#FFFFFF', confirmed: false, affiliate: true },
  vodafone:   { name: 'Vodafone',          hostNetwork: 'direct',    colour: '#E60000', pillText: '#FFFFFF', confirmed: true, affiliate: true },
  three:      { name: 'Three',             hostNetwork: 'direct',    colour: '#000000', pillText: '#FFFFFF', confirmed: false, affiliate: true, inkClash: true },
  ee:         { name: 'EE',                hostNetwork: 'direct',    colour: '#00B0B9', pillText: '#000000', confirmed: false, affiliate: false,
               note: 'Editorial listing only. EE affiliate terms prohibit comparison-table use of their feed.' },
  smarty:     { name: 'SMARTY',            hostNetwork: 'Three',     colour: '#FFE600', pillText: '#000000', confirmed: false, affiliate: true },
  voxi:       { name: 'VOXI',              hostNetwork: 'Vodafone',  colour: '#FF4E6E', pillText: '#000000', confirmed: false, affiliate: true },
  giffgaff:   { name: 'giffgaff',          hostNetwork: 'O2',        colour: '#000000', pillText: '#FFFFFF', confirmed: false, affiliate: true, inkClash: true },
  idmobile:   { name: 'iD Mobile',         hostNetwork: 'Three',     colour: '#E5007D', pillText: '#FFFFFF', confirmed: false, affiliate: true },
  tesco:      { name: 'Tesco Mobile',      hostNetwork: 'O2',        colour: '#00539F', pillText: '#FFFFFF', confirmed: false, affiliate: true },
  lebara:     { name: 'Lebara',            hostNetwork: 'Vodafone',  colour: '#E4002B', pillText: '#FFFFFF', confirmed: false, affiliate: true },
  talkmobile: { name: 'Talkmobile',        hostNetwork: 'Vodafone',  colour: '#6A2C8F', pillText: '#FFFFFF', confirmed: false, affiliate: true },
  sky:        { name: 'Sky Mobile',        hostNetwork: 'O2',        colour: '#0072C9', pillText: '#FFFFFF', confirmed: false, affiliate: null },
  bt:         { name: 'BT Mobile',         hostNetwork: 'EE',        colour: '#5514B4', pillText: '#FFFFFF', confirmed: false, affiliate: null },
  plusnet:    { name: 'Plusnet Mobile',    hostNetwork: 'EE',        colour: '#7A3E98', pillText: '#FFFFFF', confirmed: false, affiliate: true },
  asda:       { name: 'Asda Mobile',       hostNetwork: 'Vodafone',  colour: '#78BE20', pillText: '#000000', confirmed: false, affiliate: null },
  onep:       { name: '1pMobile',          hostNetwork: 'EE',        colour: '#00A0DF', pillText: '#000000', confirmed: false, affiliate: true },
  spusu:      { name: 'spusu',             hostNetwork: 'EE',        colour: '#E2001A', pillText: '#FFFFFF', confirmed: false, affiliate: false,
               note: 'No affiliate programme. Listed because leaving it out would make the list a lie.' },
  lyca:       { name: 'Lycamobile',        hostNetwork: null,        colour: '#F58220', pillText: '#000000', confirmed: false, affiliate: null },
  mozillion:  { name: 'Mozillion',         hostNetwork: null,        colour: '#1B9E77', pillText: '#000000', confirmed: false, affiliate: true,
               note: 'CLAUDE.md lists this as an EE-based MVNO. The design reference marks the host unconfirmed, so it stays null here until verified.' },
  simp:       { name: 'Simp',              hostNetwork: null,        colour: '#F5D200', pillText: '#000000', confirmed: false, affiliate: false,
               note: 'No affiliate programme. Listed for completeness.' },
  honest:     { name: 'Honest Mobile',     hostNetwork: null,        colour: '#0F5132', pillText: '#FFFFFF', confirmed: false, affiliate: false,
               note: 'No affiliate programme. Listed for completeness.' },
  revolut:    { name: 'Revolut Mobile',    hostNetwork: null,        colour: '#0075EB', pillText: '#000000', confirmed: false, affiliate: false,
               note: 'No affiliate programme. Listed for completeness.' },
  klarna:     { name: 'Klarna Mobile',     hostNetwork: null,        colour: '#FFB3C7', pillText: '#000000', confirmed: false, affiliate: false,
               note: 'No affiliate programme. Listed for completeness.' },
  uw:         { name: 'Utility Warehouse', hostNetwork: null,        colour: '#003B71', pillText: '#FFFFFF', confirmed: false, affiliate: null },
  coop:       { name: 'Your Co-op Mobile', hostNetwork: null,        colour: '#00B1E7', pillText: '#000000', confirmed: false, affiliate: null },
  ecotalk:    { name: 'Ecotalk',           hostNetwork: null,        colour: '#4CAF50', pillText: '#000000', confirmed: false, affiliate: false,
               note: 'No affiliate programme. Listed because readers ask what they charge.' },
};

export const get = (key) => networks[key] ?? null;

/** How a card describes where an MVNO actually runs. */
export const hostLabel = (net) => {
  if (!net) return null;
  if (net.hostNetwork === 'direct') return 'Direct from the network';
  if (net.hostNetwork === null) return 'Host network not confirmed';
  return `Runs on ${net.hostNetwork}`;
};
