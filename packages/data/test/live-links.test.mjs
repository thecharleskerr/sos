/* The guide-body link plugin: links to unpublished posts become text. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import rehypeLiveLinks, { liveSlugs } from '../../ui/rehype-live-links.mjs';

const dir = mkdtempSync(join(tmpdir(), 'posts-'));
writeFileSync(join(dir, 'early.md'), '---\ntitle: "Early"\npublishDate: 2026-09-01\ndraft: false\n---\nbody');
writeFileSync(join(dir, 'late.md'), '---\ntitle: "Late"\npublishDate: 2026-12-01\ndraft: false\n---\nbody');
writeFileSync(join(dir, 'draft.md'), '---\ntitle: "Draft"\npublishDate: 2026-01-01\ndraft: true\n---\nbody');
const other = mkdtempSync(join(tmpdir(), 'posts-'));
writeFileSync(join(other, 'sister.md'), '---\ntitle: "Sister"\npublishDate: 2026-12-25\n---\nbody');
const today = new Date('2026-09-04');

const a = (href, text) => ({ type: 'element', tagName: 'a', properties: { href }, children: [{ type: 'text', value: text }] });
const tree = () => ({ type: 'root', children: [{ type: 'element', tagName: 'p', properties: {}, children: [
  a('/blog/early/', 'early'), { type: 'text', value: ' and ' }, a('/blog/late/', 'late'), { type: 'text', value: ' and ' },
  a('https://sister.example/blog/sister/', 'sister'), { type: 'text', value: ' and ' }, a('/networks/', 'networks'), a('https://elsewhere.example/blog/x/', 'x'),
] }] });

test('liveSlugs applies the date and the draft flag, and preview includes every dated post', () => {
  assert.deepEqual([...liveSlugs(dir, { today })].sort(), ['early']);
  assert.deepEqual([...liveSlugs(dir, { today, preview: true })].sort(), ['early', 'late']);
});

test('links to unpublished posts unwrap to text; other links stay', () => {
  const t = tree();
  rehypeLiveLinks({ postsDir: dir, cross: { 'https://sister.example': other }, today })(t);
  const p = t.children[0].children;
  const tags = p.map((n) => (n.type === 'element' ? `${n.tagName}:${n.properties.href}` : `text:${n.value}`));
  assert.deepEqual(tags, ['a:/blog/early/', 'text: and ', 'text:late', 'text: and ', 'text:sister', 'text: and ', 'a:/networks/', 'a:https://elsewhere.example/blog/x/']);
});

test('in preview every link stays', () => {
  const t = tree();
  rehypeLiveLinks({ postsDir: dir, cross: { 'https://sister.example': other }, today, preview: true })(t);
  assert.equal(t.children[0].children.filter((n) => n.tagName === 'a').length, 5);
});
