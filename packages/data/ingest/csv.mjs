/* A small RFC 4180 parser. Awin feeds are plain CSV with a header row and
   quoted fields that can contain commas, quotes and line breaks, which is all
   this handles. No dependency, so the weekly job cannot break on a parser
   upgrade. */
export function parseCSV(text, delimiter = ',') {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  let i = text.charCodeAt(0) === 0xfeff ? 1 : 0;
  for (; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else quoted = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === delimiter) {
      row.push(field); field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      rows.push(row); row = [];
    } else {
      field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

/* Header row to keys. Blank lines are skipped and every value is trimmed. */
export function parseCSVObjects(text, delimiter = ',') {
  const rows = parseCSV(text, delimiter).filter((r) => r.some((v) => v.trim() !== ''));
  if (rows.length === 0) return { headers: [], rows: [] };
  const headers = rows[0].map((h) => h.trim());
  const out = rows.slice(1).map((r) => Object.fromEntries(headers.map((h, i) => [h, (r[i] ?? '').trim()])));
  return { headers, rows: out };
}
