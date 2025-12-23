# ADR 0002: Feature-Based Architecture

## Status

Accepted

## Context

We need a scalable folder structure that:
- Groups related code together
- Makes it easy to find code
- Supports team collaboration
- Separates concerns clearly

## Decision

Use **feature-based architecture** with the following structure:

```
features/
├── auth/
│   ├── services/
│   ├── types/
│   ├── hooks/
│   └── components/ (optional)
├── courses/
│   ├── services/
│   ├── types/
│   ├── mocks/
│   └── components/ (optional)
└── ...
```

## Implementation

- **Services:** `features/{feature}/services/{feature}.service.ts`
- **Types:** `features/{feature}/types/{feature}.types.ts`
- **Mocks:** `features/{feature}/mocks/{feature}.mocks.ts`
- **Hooks:** `features/{feature}/hooks/use*.ts`
- **Components:** `features/{feature}/components/` (optional, or use `core/components/`)

## Consequences

### Positive

- ✅ Related code is co-located
- ✅ Easy to find code for a feature
- ✅ Clear boundaries between features
- ✅ Supports parallel development

### Negative

- ⚠️ Some duplication (e.g., hooks in both `hooks/` and `features/*/hooks/`)
- ⚠️ Need to decide: feature components vs `core/components/`

## Alternatives Considered

1. **Layer-based** (services/, components/, hooks/) - Rejected: Harder to find related code
2. **Domain-driven** - Similar to feature-based, accepted
3. **Monolithic** - Rejected: Doesn't scale

