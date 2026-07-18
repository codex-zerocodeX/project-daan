# Daan brand token

The Daan interface uses a warm civic daylight palette: paper-like surfaces, deep ink, and semantic verdict color that always appears with a label and icon.

## Color

| Token | Value | Use |
|---|---:|---|
| `paper` | `#f7f4ed` | Page background |
| `surface` | `#fffdf8` | Primary surface |
| `ink` | `#17201d` | Primary text and score numeral |
| `ink-soft` | `#53605b` | Secondary text |
| `line` | `#d9ded8` | Dividers and controls |
| `pleasant` | `#15803d` | Comfortable walking conditions |
| `manageable` | `#ca8a04` | Walkable with trade-offs |
| `harsh` | `#ea580c` | High-friction walking conditions |
| `avoid` | `#dc2626` | Conditions where another mode is advised |
| `unknown` | `#64748b` | Missing evidence, never imputed |

`ink` on `paper` is approximately 14.7:1, comfortably above the 7:1 score-numeral target.

## Type

- Product stack: Inter, system UI, sans-serif fallback.
- Score: 64 px / 800.
- Section title: 20 px / 700.
- Body: 15 px / 450 where supported, 500 fallback.
- Receipt detail: 13 px monospace with tabular numerals.

## Geometry

- Spacing begins on a 4 px grid.
- Card radius: 12 px.
- Chip radius: 999 px.
- One elevation only: `0 16px 40px rgb(23 32 29 / 0.08)`.

## Motion

The score and verdict cross-fade over 600 ms when departure time changes. Every other state change is immediate. Reduced-motion preferences disable the transition and the score count.
