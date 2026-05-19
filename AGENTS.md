# math4js

JavaScript/Node.js math library. Modules: `statistics/`, `linear_algebra/`, `ndarray/`, `plot/`.

## Dev commands

```bash
npm run lint       # ESLint (uses @typescript-eslint parser)
npm run test       # Jest (ts-jest preset, tests in test/**/*.ts)
npm run typecheck  # tsc --noEmit
npm run format     # prettier --write
npm run build      # tsc → dist/
```

**test.sh** runs: `npm install` → `npm run lint` → `npm run test` (no typecheck/format in CI).

## Project structure

```
src/math4js/          # Source modules
  statistics/         # stats, random, hypothesis, interval, info, theorem, distributions
  ndarray/            # ndarray, operations, random
  linear_algebra/     # Matrix, vector, function, theorem
  plot/               # rplot (plotly.js wrapper)
test/                 # Jest tests, mirror src layout
dist/                 # Compiled output (commonjs, ES2022)
```

## Key packages

- `jstat` — statistical distributions (normal, t, chi-square, F, binomial, Poisson)
- `numeric` — linear algebra (eig, svd, matrix ops)
- `plotly.js` — plotting

## Conventions

- TypeScript strict mode, ES2022 target, commonjs modules
- Traditional Chinese comments on code (from `ccc_code_skill.md`)
- Module exports use `.js` extension in imports (required for ESM interop with commonjs)
- Jest: `test/**/*.ts` files, `ts-jest` preset; `test/` files exempt from `@typescript-eslint/no-explicit-any`
- Version docs: `_doc/v0.x.md`
- `src/types.d.ts` declares untyped dependencies (`jstat`, `numeric`)