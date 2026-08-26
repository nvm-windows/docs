# Troubleshooting

| Symptom | Likely Cause | Verify | Fix |
|:-|:-|:-|:-|
| `vX is not installed` on `nvm use X` | Requested version missing and auto-install disabled | `nvm list installed` | `nvm install X`; optionally `nvm use X --install` |
| `No previously active version found.` on `nvm use last` | No prior default captured yet | `nvm default` | Set one version with `nvm use X`, then retry `nvm use last` |
| `No versions installed.` | Fresh machine or install root mismatch | `nvm env`; `nvm config get root` | `nvm install lts`; correct root with `nvm config set root=...` |
| `Blocked by this computer's policy.` | Policy-managed setting/operation | `nvm config list`; `nvm config get <key>` | Coordinate with IT policy owner; do not force local overrides |
| `sync.exe not found` for `doctor` or `upgrade` | Missing/corrupt sync utility | `nvm env`; run `nvm doctor --list` | Reinstall/repair distribution so sync utility is restored |
| Link mode fails to activate | Link/junction privilege or path issue | `nvm use link`; `nvm env` | Switch to shim (`nvm use shim`) or grant required link privileges |
| Cache grows too large | Long-lived cache retention | `nvm cache list`; `nvm list cached` | `nvm cache remove version ...`; `nvm cache remove all` |
| Mirror unreachable warnings | Network/proxy/mirror issue | `nvm env` mirror reachability section | Set mirrors/proxy with `nvm config set node_mirror=... npm_mirror=... proxy=...` |
| Alias command rejected | Reserved alias name used | `nvm alias list` | Choose non-reserved alias (`legacy`, `stable24`, etc.) |
| `package.json not found` with `nvm pin --file=package.json` | Command run in wrong directory | `dir package.json` | Run command in project root or use `.nvmrc` target |

## Suggested Triage Flow

1. Capture environment snapshot.

```powershell
nvm env
nvm default
nvm config list
```

2. Validate installed/runtime state.

```powershell
nvm list installed
nvm list cached
where.exe node
```

3. Run diagnostics.

```powershell
nvm doctor --list
nvm doctor
```

4. Apply targeted fix (install, use, config, cache, or mode).

5. Re-verify with `nvm env` and `nvm doctor`.

## Enterprise Notes

- In certified/managed environments, policy can intentionally block local mutation for specific settings.
- Prefer policy-compliant remediation over manual registry edits.
- For fleet issues, use `nvm env --json` and `nvm doctor --json` to collect machine-readable diagnostics.
