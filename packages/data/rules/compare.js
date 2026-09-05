/* The head-to-head pages: pairs people actually search, each a page that
   sets two networks' verified facts side by side. Order within a pair is
   the order people say it. */
export const pairs = [
  ['smarty', 'giffgaff'], ['o2', 'vodafone'], ['o2', 'three'], ['vodafone', 'three'], ['ee', 'o2'], ['ee', 'vodafone'], ['ee', 'three'],
  ['smarty', 'voxi'], ['giffgaff', 'voxi'], ['smarty', 'idmobile'], ['giffgaff', 'idmobile'], ['smarty', 'lebara'], ['lebara', 'lyca'],
  ['tesco', 'giffgaff'], ['sky', 'tesco'], ['simp', 'smarty'], ['honest', 'smarty'], ['talkmobile', 'voxi'], ['asda', 'lebara'], ['onep', 'giffgaff'],
  ['voxi', 'idmobile'], ['tesco', 'smarty'], ['o2', 'giffgaff'], ['three', 'smarty'], ['vodafone', 'voxi'],
];
export const pairSlug = ([a, b]) => `${a}-vs-${b}`;
