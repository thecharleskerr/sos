import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCSV, parseCSVObjects } from '../ingest/csv.mjs';

test('quoted commas, escaped quotes, CRLF and a BOM', () => {
  const text = '﻿a,b,c\r\n1,"x, y","say ""hi"""\r\n2,,\n';
  const { headers, rows } = parseCSVObjects(text);
  assert.deepEqual(headers, ['a', 'b', 'c']);
  assert.deepEqual(rows, [{ a: '1', b: 'x, y', c: 'say "hi"' }, { a: '2', b: '', c: '' }]);
});

test('a line break inside quotes stays in the field', () => {
  assert.deepEqual(parseCSV('h\n"two\nlines"\n'), [['h'], ['two\nlines']]);
});

test('blank lines are skipped and an empty file gives no rows', () => {
  assert.equal(parseCSVObjects('a,b\n\n1,2\n\n').rows.length, 1);
  assert.deepEqual(parseCSVObjects(''), { headers: [], rows: [] });
});
