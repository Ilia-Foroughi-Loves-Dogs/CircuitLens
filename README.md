# CircuitLens

Phase 2 of a visual debugger for beginner breadboard circuits, built with Next.js, TypeScript, and Tailwind CSS.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000. Production checks: `npm run typecheck` and `npm run build`.

With the development server running and Google Chrome installed, run `npm run test:smoke` to verify the demo, upload validation, responsive layouts, and browser errors. Run `npm run format` to format the source.

The workspace supports local photo selection and drag-and-drop (JPG, PNG, WebP; 10 MB limit), a circuit description, an illustrated LED demo, and reactive workspace status. Images remain in browser memory. Once an image and description are provided, Analyze Circuit simulates a 1.4-second analysis and displays fixed mock results: an Arduino Uno, a red LED, an approximately 220-ohm resistor, four jumper wires, and two issues with suggested fixes. Changing the image or description clears results and cancels pending analysis. Results are explicitly labeled as simulated; no backend or AI API is connected.

Components live in `src/components`, including reusable `AnalysisPanel`, `ComponentList`, and `IssueCard` components. `SeverityBadge` supports HIGH, MEDIUM, and LOW. Mock data and result types live in `src/lib/mockAnalysis.ts`. The main workspace state lives in `src/app/page.tsx`; the visual system is in `src/app/globals.css`.
