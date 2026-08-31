# Astro security advisories, and why we have not upgraded yet

Last reviewed: 31 August 2026. Astro pinned at 5.18.2 (`^5.2.5`).

`npm audit` reports 3 vulnerable packages and 10 advisories. The headline
count is misleading for this project, so this note records which advisories
can actually reach us and which cannot. Re-read it before dismissing a future
audit result, because the answer changes the moment we adopt SSR.

## The decision

We are staying on 5.18.2 for now and documenting the exposure. We are not
taking the upgrade, for three reasons:

1. 5.18.2 is the last release in the 5.x line, so there is no patch to take.
   The only fix is a major upgrade.
2. Both 6.4.8 and 7.2.10 require Node >= 22.12.0. Our CI now runs Node 22,
   which unblocks this, but Cloudflare Pages must also provide 22.12 or later
   before either version can deploy.
3. Every advisory below is either unreachable in a static build or requires a
   code pattern we do not use. None is reachable today.

This is a deliberate deferral, not a dismissal. Revisit it when we adopt any
server rendering, or on the next scheduled dependency review.

## Why a static build changes the analysis

Both sites are `output: 'static'` with no adapter, no SSR, no server islands
and no view transitions. The build turns author-controlled data into HTML
files, and Cloudflare Pages serves those files. There is no Astro server in
production, so any advisory that depends on Astro handling a live request
cannot apply to what we deploy.

Verified absent from the codebase as at the date above: spread props
(`{...attrs}`), `define:vars`, named slots, `set:html`, and `astro:assets`
or `<Image>`.

## Advisory by advisory

| Advisory | Severity | Reachable here | Why |
|---|---|---|---|
| [GHSA-2pvr-wf23-7pc7](https://github.com/advisories/GHSA-2pvr-wf23-7pc7) Host header SSRF in prerendered error page fetch | High | No | Needs Astro serving a live request. We ship static files. |
| [GHSA-8hv8-536x-4wqp](https://github.com/advisories/GHSA-8hv8-536x-4wqp) Reflected XSS via unescaped slot name | High | No | Reflected XSS needs request data. We use one unnamed `<slot />`. |
| [GHSA-jrpj-wcv7-9fh9](https://github.com/advisories/GHSA-jrpj-wcv7-9fh9) XSS via unescaped attribute names in spread props | Moderate | No | We use no spread props. |
| [GHSA-f48w-9m4c-m7f5](https://github.com/advisories/GHSA-f48w-9m4c-m7f5) XSS via spread attribute names in renderHTMLElement | Moderate | No | As above. |
| [GHSA-4g3v-8h47-v7g6](https://github.com/advisories/GHSA-4g3v-8h47-v7g6) Reflected XSS via View Transition animation properties | Moderate | No | View transitions are not used. Note this one is unfixed through 7.0.9. |
| [GHSA-j687-52p2-xcff](https://github.com/advisories/GHSA-j687-52p2-xcff) XSS in `define:vars` via incomplete `</script>` sanitisation | Moderate | No | `define:vars` is not used. |
| [GHSA-7pw4-f3q4-r2p2](https://github.com/advisories/GHSA-7pw4-f3q4-r2p2) XSS via `transition:*` values on hydrated islands | Low | No | No transition directives, no hydrated islands. |
| [GHSA-xr5h-phrj-8vxv](https://github.com/advisories/GHSA-xr5h-phrj-8vxv) Server island encrypted parameter replay | Low | No | Server islands are not used. |
| [GHSA-g7r4-m6w7-qqqr](https://github.com/advisories/GHSA-g7r4-m6w7-qqqr) esbuild arbitrary file read via dev server | Low | No | Dev server only, and Windows only. We build on Linux. |
| [GHSA-f88m-g3jw-g9cj](https://github.com/advisories/GHSA-f88m-g3jw-g9cj) sharp inherits libvips CVEs | High | Not yet | Build-time image processing. We process no images today. See the warning below. |

## The one that will bite us later

`sharp` is the item to watch. It is unreachable now only because we process no
images. `DealSchema` already carries `device.imageUrl`, and the phones site is
built to list handsets. The moment we pass feed-supplied image URLs through
`astro:assets`, a third-party feed starts feeding a vulnerable libvips at build
time, and the exposure becomes real.

So: resolve the Astro upgrade before the phones site starts rendering device
images, not after.

## Upgrade path when we take it

- Target 7.2.10, which clears every advisory above including the View
  Transition one that 7.0.9 does not.
- Requires Node >= 22.12.0 in CI and on Cloudflare Pages.
- Two majors, so expect config and API breakage. Take it as its own pull
  request with nothing else in it, and confirm both sites build.
