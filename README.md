# UME — Universal Modding Empire

UME is a scroll-driven precision-studio site for a cross-game, cross-engine modding vision. It uses a procedural Three.js studio scene: instanced file-format slabs, a connected territory map, and a calm dotted floor. No external models, textures, or HDRIs are required.

## Run locally

Use Node.js 20 or newer.

```sh
npm install
npm run dev
```

Vite prints the local address after the development server starts. Create and preview a production build with:

```sh
npm run build
npm run preview
```

## Deploy to Cloudflare Pages

Create a Cloudflare Pages project connected to this repository and set:

- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Environment variable:** `NODE_VERSION` = `20`

Add `ume.qd.je` in the Pages project’s custom domains and configure the DNS record as Cloudflare Pages requests.

## Notes

- Package versions are pinned in `package.json`.
- The Canvas is lazy-loaded. The DOM site stays usable with the file-slab fallback when WebGL is unavailable.
- Reduced-motion preferences disable scrambling, Lenis scrolling, the camera scrub, and visual loops.
- Mobile and low-capability devices use a lower DPR and fewer floor instances.
- The placeholder project entries live in `src/data/projects.ts` and should be replaced with approved descriptions and links.
