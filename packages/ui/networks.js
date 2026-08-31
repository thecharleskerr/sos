/* Network reference data.
 *
 * WARNING: the hex values below are approximations placed here so the
 * scaffold renders. Before launch, replace every one with the exact colour
 * from the network's official brand or press kit. Do not ship guesses.
 *
 * hostNetwork is the underlying radio network, which is what actually
 * determines coverage. MVNOs must always display it.
 */
export const networks = {
  o2:        { name: 'O2',            hostNetwork: 'O2',       colour: '#0019A5', affiliate: true  },
  vodafone:  { name: 'Vodafone',      hostNetwork: 'Vodafone', colour: '#E60000', affiliate: true  },
  three:     { name: 'Three',         hostNetwork: 'Three',    colour: '#EE2E7B', affiliate: true  },
  ee:        { name: 'EE',            hostNetwork: 'EE',       colour: '#00B5B0', affiliate: false,
               note: 'Editorial listing only. EE affiliate terms prohibit comparison-table use of their feed.' },
  smarty:    { name: 'SMARTY',        hostNetwork: 'Three',    colour: '#00E1A0', affiliate: true  },
  voxi:      { name: 'VOXI',          hostNetwork: 'Vodafone', colour: '#E60000', affiliate: true  },
  giffgaff:  { name: 'giffgaff',      hostNetwork: 'O2',       colour: '#000000', affiliate: true  },
  idmobile:  { name: 'iD Mobile',     hostNetwork: 'Three',    colour: '#FF6B00', affiliate: true  },
  tesco:     { name: 'Tesco Mobile',  hostNetwork: 'O2',       colour: '#00539F', affiliate: true  },
  lebara:    { name: 'Lebara',        hostNetwork: 'Vodafone', colour: '#004B87', affiliate: true  },
  talkmobile:{ name: 'Talkmobile',    hostNetwork: 'Vodafone', colour: '#7AB800', affiliate: true  },
  onep:      { name: '1pMobile',      hostNetwork: 'EE',       colour: '#E4002B', affiliate: true  },
  plusnet:   { name: 'Plusnet Mobile',hostNetwork: 'EE',       colour: '#1E1E1E', affiliate: true  },
  mozillion: { name: 'Mozillion',     hostNetwork: 'EE',       colour: '#5C2D91', affiliate: true  },
  simp:      { name: 'Simp',          hostNetwork: 'Three',    colour: '#FFE500', affiliate: false,
               note: 'No affiliate programme. Listed for completeness.' },
  honest:    { name: 'Honest Mobile', hostNetwork: 'Three',    colour: '#1B4D3E', affiliate: false,
               note: 'No affiliate programme. Listed for completeness.' },
  revolut:   { name: 'Revolut Mobile',hostNetwork: 'Three',    colour: '#191C1F', affiliate: false,
               note: 'No affiliate programme. Listed for completeness.' },
  klarna:    { name: 'Klarna Mobile', hostNetwork: 'Three',    colour: '#FFB3C7', affiliate: false,
               note: 'No affiliate programme. Listed for completeness.' },
};

export const get = (key) => networks[key] ?? null;
