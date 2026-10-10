# CircuitLens

Phase 1 of a visual debugger for beginner breadboard circuits, built with Next.js, TypeScript, and Tailwind CSS.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000. Production checks: `npm run typecheck` and `npm run build`.

With the development server running and Google Chrome installed, run `npm run test:smoke` to verify the demo, upload validation, responsive layouts, and browser errors. Run `npm run format` to format the source.

The foundation supports local photo selection and drag-and-drop (JPG, PNG, WebP; 10 MB limit), a circuit description, an illustrated LED demo, and reactive workspace status. Images remain in browser memory. Analyze Circuit displays the Phase 1 placeholder once an image and description are provided; no circuit analysis, backend, or AI calls are implemented.

Components live in `src/components`: `CircuitUploader`, `CircuitViewer`, and `CircuitStatus`. The main workspace state lives in `src/app/page.tsx`; the visual system is in `src/app/globals.css`.
