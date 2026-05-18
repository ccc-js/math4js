# math4js

A JavaScript/Node.js math library. Source code does not yet exist — this is a greenfield project.

## Development conventions (from `_doc/ccc_code_skill.md`)

- Write unit tests for every module. For JS projects, use Jest.
- Create `test.sh` as the project test script. Run lint → format → typecheck → test.
- Code >1000 lines must be split into modules.
- Version plans go in `_doc/v0.x.md` (e.g., `_doc/v0.1.md`, `_doc/v0.2.md`). Each release bumps +0.1.
- All paths must be relative (use `./` or `../`), no absolute paths.
- Code must compile/build with zero warnings.
- When generating large code blocks, use split-and-heartbeat: send smaller batches, wait for `go` to continue.

## Documentation conventions (from `_doc/ccc_doc_skill.md`)

- Default language: Traditional Chinese (繁體中文). First occurrence of technical terms include English in parentheses.
- Each code file gets a corresponding `.md` doc explaining theoretical background, not just code comments.
- Detailed comments in Traditional Chinese on code.
- Subfolders containing code get a `README.md` summarizing each file.
- `_doc/` holds: `plan.md`, `v0.x.md` versions, `todo.md`.
- Reference: [LLM wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) for \_wiki/ term explanations.

## Project plan (from `_doc/plan.md`)

- Reference: `/Users/Shared/ccc/project/math4py/`
- Port from `math4py/statistics/` → then `math4py/plot/`
- **First priority**: implement a seeded random number generator (JS has no built-in seed support)
- Then port statistical functions, then plotting utilities.

## Initial setup

- This repo has no `package.json` or source yet. Set up the Node.js project structure first.
- Use the `.gitignore` already configured for Node.js (npm, yarn, pnpm, etc.).
