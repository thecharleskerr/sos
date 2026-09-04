/* Everything verified about a network, as short lines and as sentences,
   from the compliance tables passed in. Pages pass the tables so this file
   stays plain JavaScript. Every sentence is built from a verified entry or
   says the fact is not verified. */
import { gbp } from './money.js';

const verified = (e) => Boolean(e && e.evidence !== 'unverified');
const stop = (t) => (/[.!?]$/.test(t) ? t : `${t}.`);

export function networkFacts(key, net, tables) {
  const { roaming = {}, priceRises = {}, students = {}, esim = {}, perks = {} } = tables;
  const r = roaming[key], p = priceRises[key], s = students[key], e = esim[key], k = perks[key];
  const host = net.hostNetwork === 'direct' ? null : (net.hostNetwork ?? null);

  const hostShort = net.hostNetwork === 'direct' ? 'Its own network' : (host ?? 'Not stated');
  const hostLine = net.hostNetwork === 'direct'
    ? `${net.name} owns its network, which is what decides your coverage.`
    : host ? `${net.name} runs on ${host}'s network, which is what decides your coverage.` : `Which network ${net.name} runs on is not stated on its own pages.`;

  let roamShort = 'To confirm', roamLine = 'EU roaming is not verified against the network\'s own pages yet.', daily = 'To confirm', cap = 'To confirm';
  if (verified(r)) {
    cap = r.euCapGB !== null ? `${r.euCapGB}GB` : r.euCapText ?? 'Not stated';
    const capText = r.euCapGB !== null ? `${r.euCapGB}GB fair use cap` : r.euCapText ? `${r.euCapText} fair use cap` : 'no cap stated';
    daily = r.dailyChargeGBP !== null ? `${gbp(r.dailyChargeGBP)} a day` : r.euIncluded === true ? 'None' : 'Not stated';
    if (r.euIncluded === true) { roamShort = `Included, ${cap} cap`; roamLine = `EU roaming is included with no daily charge, with a ${capText}.`; }
    else if (r.euIncluded === false) { roamShort = r.dailyChargeGBP !== null ? `${gbp(r.dailyChargeGBP)} a day, ${cap} cap` : `Charged, ${cap} cap`; roamLine = r.dailyChargeGBP !== null ? `EU roaming is charged at ${gbp(r.dailyChargeGBP)} a day, with a ${capText}. A week in Spain is ${gbp(r.dailyChargeGBP * 7)}.` : `EU roaming is charged, with a ${capText}.`; }
    else if (r.euIncludedText) { roamShort = r.euIncludedText; roamLine = `EU roaming is included ${r.euIncludedText.charAt(0).toLowerCase()}${r.euIncludedText.slice(1)}${r.dailyChargeGBP !== null ? `, and other plans pay ${gbp(r.dailyChargeGBP)} a day` : ''}, with a ${capText}.`; }
    if (r.note) roamLine += ` ${stop(r.note)}`;
  }

  let riseShort = 'To confirm', riseLine = 'The mid-contract price rise is not verified against the network\'s own terms yet, so its deals are held back from the weekly picks until it is.';
  if (verified(p)) {
    if (p.type === 'none') { riseShort = 'No price rise'; riseLine = `${net.name} states no mid-contract price rise.`; }
    else if (p.type === 'fixed' && p.amountGBP !== null) { riseShort = `${gbp(p.amountGBP)} a month each ${p.month}`; riseLine = `The price goes up by ${gbp(p.amountGBP)} a month each ${p.month}, stated in pounds and pence as Ofcom requires.`; }
    else if (p.type === 'fixed' && p.tiers) { riseShort = `By plan size each ${p.month}`; riseLine = `The price goes up each ${p.month} by a fixed amount set by plan size: ${p.tiers.map((t, i) => `${gbp(t.amountGBP)} on plans ${t.maxGB === null ? `over ${p.tiers[i - 1].maxGB}GB` : i === 0 ? `up to ${t.maxGB}GB` : `from ${p.tiers[i - 1].maxGB + 1}GB to ${t.maxGB}GB`}`).join(', ')}.`; }
    if (p.appliesTo) riseLine += ` ${stop(p.appliesTo)}`;
  }

  const studentShort = s?.hasOffer === true ? 'Yes' : 'None found';
  const studentLine = s?.hasOffer === true ? `${stop(s.offer)}${s.via ? ` Claimed via ${s.via === 'direct' ? 'the network itself' : s.via}.` : ''}` : `No student offer was found on ${net.name}'s own pages.`;

  const esimShort = verified(e) ? (e.offered ? 'Yes' : 'No') : 'To confirm';
  const esimLine = verified(e) ? (e.offered ? `eSIM is offered. ${stop(e.detail ?? '')}`.trim() : `${net.name}'s pages say it does not offer eSIM.`) : `Whether ${net.name} offers eSIM is not verified against its own pages yet.`;

  const perksShort = verified(k) ? (k.scheme ?? 'None stated') : 'To confirm';
  const perksLine = verified(k) ? (k.scheme ? `${k.scheme}: ${stop(k.detail ?? '')}` : `${net.name}'s pages describe no rewards scheme.`) : `Perks are not verified against ${net.name}'s own pages yet.`;

  const sources = [
    verified(r) && { name: `${net.name}, roaming`, url: r.source, checked: r.checked },
    verified(p) && { name: `${net.name}, price changes`, url: p.source, checked: p.checked },
    s?.hasOffer === true && s.source && { name: `${net.name}, student offer`, url: s.source, checked: s.checked },
    verified(e) && e.source && { name: `${net.name}, eSIM`, url: e.source, checked: e.checked },
    verified(k) && k.source && { name: `${net.name}, ${k.scheme ?? 'rewards'}`, url: k.source, checked: k.checked },
  ].filter(Boolean);
  const checked = [r?.checked, p?.checked, s?.checked, e?.checked, k?.checked].filter(Boolean).sort().at(-1) ?? null;

  return {
    host: { short: hostShort, line: hostLine },
    roaming: { short: roamShort, line: roamLine, daily, cap, verified: verified(r), checked: r?.checked ?? null },
    rise: { short: riseShort, line: riseLine, verified: verified(p), checked: p?.checked ?? null },
    student: { short: studentShort, line: studentLine, checked: s?.checked ?? null },
    esim: { short: esimShort, line: esimLine, verified: verified(e), checked: e?.checked ?? null },
    perks: { short: perksShort, line: perksLine, verified: verified(k), checked: k?.checked ?? null },
    sources, checked,
  };
}
