# HP Science Study

Study practice for Chapter 8, **Measurement and Units**: metric prefixes, scientific notation, graduated cylinders, the conversion-factor method, rates, vocabulary and volume.

Live at **https://partlywhole.github.io/HPScienceStudy/**

It is built for recall. Every session starts with a warm-up and ends with an exit check, both without notes, and whatever is missed opens the next warm-up. Answers are typed: numbers as `4500`, `4.5 x 10^3`, `4.5e3` or `1/100`. When a question asks for scientific notation or standard form, the form counts. See [docs/PLAN.md](docs/PLAN.md) for the design and what comes next.

Progress is kept in the browser only.

## Develop

```bash
npm install
npm run dev     # http://127.0.0.1:4200
npm run check   # tests, TypeScript and the production build
```

Pushing to `main` deploys to GitHub Pages.

## Layout

- `src/content/`: the course: units, lessons, notes and the question makers (fixed questions from the plan, and generators).
- `src/engine/`: grading, sessions and progress.
- `src/lib/`: reading typed numbers, and a seeded random generator.
- `src/ui/`: the plan page, the lesson player, questions and the cylinder drawing.
- `tests/`: every generator is replayed over many seeds, and every answer is checked to grade right when typed the way it is asked for.
