# Finishing Checklist

Follow this checklist after you finish coding a feature or fix. It keeps commits consistent and ensures code quality.

## 1) Sync with remote

```
git checkout develop
git pull origin develop
git checkout -   # returns to previous branch (your feature branch)
git merge develop   # or: git rebase develop
```

Resolve conflicts, run tests locally if necessary.

## 2) Format & check

- Format the whole repository (Prettier + Tailwind plugin):

```
pnpm run format
```

- Check formatting only (CI-friendly):

```
pnpm run format:check
```

## 3) Lint & tests

Run ESLint and your test suite:

```
pnpm run lint
# run tests if available
pnpm test
```

Fix any lint or test failures before proceeding.

## 4) Format staged files (optional local quick run)

Husky runs `lint-staged` on pre-commit automatically. To run locally before committing:

```
pnpm -s lint-staged
```

Or use `pretty-quick` to format staged files:

```
pnpm exec -- pretty-quick --staged
```

## 5) Commit with Commitizen (recommended)

Use the interactive conventional commit prompt:

```
pnpm commit
```

This uses `cz-conventional-changelog` to create conventional commit messages (e.g., `feat:`, `fix:`).

### What happens on commit

- Husky runs the `pre-commit` hook which runs `lint-staged`.
- `lint-staged` runs `prettier --write` on staged files (using your `.prettierrc` and the Tailwind plugin), then the commit continues.

If a hook blocks the commit, fix the issues and re-stage. To skip hooks (not recommended):

```
git commit --no-verify -m "chore: temporary bypass"
```

## 6) Push & open PR

```
git push -u origin feature/your-branch-name
```

- Open a Pull Request targeting `develop` (or `main` for hotfixes).
- Ensure CI passes and request reviews.

## 7) Merge and release

- For features: merge into `develop` after approval.
- For releases: create `release/*` branch, run final checks, merge into `main`, tag, and merge back into `develop`.

Tagging example:

```
git checkout main
git pull origin main
git merge --no-ff release/1.2.0
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin main --tags
```

## Quick command summary

````
# Format everything
pnpm run format

# Check formatting
pnpm run format:check

# Lint
pnpm run lint

# Format staged files
pnpm -s lint-staged

# Commit interactively
pnpm commit

# Skip hooks (only if necessary)
git commit --no-verify

## One-command finish (format, lint, commit)

You can run a single command that formats the repo, runs lint, then opens the Commitizen interactive commit prompt:

```bash
pnpm run finish
````

This runs the following sequence:

- `pnpm run format` — runs Prettier (with Tailwind plugin)
- `pnpm run lint:ci` — runs ESLint and fails if there are warnings or errors (`--max-warnings=0`)
- `pnpm commit` — opens the Commitizen interactive prompt to create a conventional commit

If lint produces warnings or errors, `pnpm run finish` will stop and will not run the commit step. Fix the reported issues and re-run `pnpm run finish`.

Husky's pre-commit hook will still run `lint-staged` after you create the commit; if `lint-staged` modifies staged files, you may need to re-stage and re-run `pnpm commit`.

```

## Notes

- Follow your team's branch naming and PR rules.
- Use `pnpm commit` + Husky + lint-staged to keep the repo consistent.
```
