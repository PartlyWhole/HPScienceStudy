# Plan

A study site for Chapter 8, Measurement and Units (8th-grade science), built around a five-session tutoring plan that ends with the Chapter 8 Test on Wed, Oct 14.

## What it is for

The student does homework and classwork well but loses points on quizzes and tests, where the answer has to come from memory. So the site trains **recall without notes**, not re-teaching:

- Nearly every question makes the student produce the answer (type it), rather than recognise it.
- Every session opens with a no-notes warm-up and closes with a no-notes exit check.
- Anything missed carries into the next warm-up.

## Rules

- **No personal details.** The site is public. It carries no names, grades or class roster, only the course and its deadline dates.
- **Graded work stays the student's.** The site has no answers to the assigned Learning Checks or Chapter Exercises and no textbook answer key. Its questions are the tutoring plan's practice problems and generated ones like them.
- **Progress stays in the browser** (localStorage). There are no accounts, and nothing is sent anywhere.

## Shape

Five units, one per tutoring session, each ready before the graded work it prepares for:

| Unit | Session | Prepares for | Focus |
|---|---|---|---|
| 1 | Wed, Sep 30 | Sep 30 classwork, Oct 1 Rainbow Lab | Prefixes, scientific notation, reading a graduated cylinder |
| 2 | Sun, Oct 4 | Oct 5 quizzes and worksheets | The conversion-factor method: one- and two-step conversions |
| 3 | Tue, Oct 6 | Oct 7 quiz and Learning Checks | Rate ("per") conversions and the 13 vocabulary terms |
| 4 | Sun, Oct 11 | Oct 12 volume quiz | Volume of boxes, cylinders and L-shapes; cm³ ↔ mL ↔ L |
| 5 | Tue, Oct 13 | Oct 14 Chapter 8 Test | Timed practice test and review of every miss |

Each unit follows the plan's session pattern:

1. **Warm-up** (no notes), opening with whatever was missed last time.
2. **Lessons:** short notes cards, then practice. The plan's own problems come first, then generated ones.
3. **Exit check** (no notes).

Inside a lesson:

- A miss comes back once, freshly made, at the end. The exit check is the exception, since it is a check.
- Any answered question can be revisited with ‹ ›.

## For a young learner

Rules the site keeps, from walking through it as a first-time 13-year-old:

- **Short lessons.** A lesson is 8 questions at most, and a card set is 6 cards, so a sitting ends before attention runs out. The home page shows each lesson's size and one "Start here".
- **Blanks are allowed.** A fill-in table can be checked with boxes left empty, since a blank means "don't know yet". It is scored cell by cell ("4 of 10"), and only the missed rows come back.
- **Short feedback.** The verdict, the one thing that went wrong, and the answer. The full reasoning sits behind "Why?".
- **Retries are remembered, not re-read.** A miss comes back three questions later, as a fresh variant where there is one. With nothing in between, it waits for the next warm-up instead.
- **Notes aren't the answer key.** The notes' worked examples never use a practice or exit question's numbers. Notes introduce at most four new terms at a time, and the cylinder notes show a drawn cylinder with the bottom of the curve marked.
- **Gentle first contact.** The first warm-up says to leave blank what he doesn't know yet. Answers like "a million" are read as numbers.

## Matched to the class handouts

- **Prefixes follow the class's metric ladder:** King Henry Doesn't Usually Drink Chocolate Milk (kilo, hecto, deca, base unit, deci, centi, milli) on meters, liters and grams. Each step down multiplies by 10 and moves the decimal one place right; each step up divides by 10 and moves it left. Mega, micro, watts, m³ and gallons are gone, and volume sticks to cm³, mL and L.
- **Scientific notation follows the class's four steps:**
  1. Move the decimal to the right of the first non-zero number.
  2. Count the places it moved.
  3. Moved right: the exponent is negative.
  4. Moved left: the exponent is positive.

  A "move the decimal" question has him move the point along the digits and write the exponent. A miss names the step that went wrong. Answers in scientific notation are typed in two boxes, the number and a raised exponent.
- **The SI sheet's seven base units** (quantity, unit, symbol) are in the vocabulary.
- **The plan's "three traps" are no longer taught.**

## Question types

| Type | Status | What it asks |
|---|---|---|
| Typed number | Built | Accepts 4,500 · 4.5 × 10^3 · 4.5e3 · 1/100, and shows back how it reads. A question can ask for a form ("in scientific notation"); a right value in the wrong form is marked wrong and the note says why. Named wrong answers (traps) get their own explanation: the flipped prefix, the wrong sign of the power, the reading at the edge of the meniscus. |
| Typed text | Built | Prefix names. |
| Fill-in table | Built | The prefixes and their symbols, from memory. |
| Multiple choice | Built | Where recognising is the skill: symbols, the prefix traps, the scientific-notation sense check. |
| Graduated cylinder | Built | A drawn close-up. Lines are worth 0.2–5 mL, and the water climbs the glass. Covers reading the level and displacement. |
| Conversion-factor builder | Built | The chain is built from unit tiles on horizontal fraction bars, with units cancelling on screen. An upside-down factor is caught and explained. Then the number. |
| Vocabulary recall | Built | Term → the student writes a definition, then checks it against the key words. Matching and multiple choice too. |
| Volume | Built | Boxes, cylinders (diameter given, radius needed), L-shapes, units cubed, percent difference. |
| Timed practice test | Unit 5 | The plan's 19 questions in 30 minutes. Each miss is labelled with the plan's five mistake types and gets a fresh problem of the same kind. |
| 3×5 study card | Unit 5 | Built with the student, as the plan suggests. |

**Conversion-factor builder, as built.** He types each factor's numbers and chooses its units, top and bottom, and units strike through as they cancel. A "Units left" line updates as he goes. Grading checks:

- that each factor is true (its top and bottom the same amount), and that it is the right way up;
- that the units left over are the ones asked for;
- the number itself.

Each fault gets its own note, and a worked setup is shown after a miss. Guided questions fill in the units and leave the numbers.

**Unit 3, as built.**

- **Rates.** The chain handles "per" units: convert the top unit, then the bottom, and a bottom unit on the wrong side is named as upside down. The plan's mile and gallon factors (1,609 m, 3.785 L) are used where it says to.
- **Vocabulary.** He writes each definition, and it is checked against the plan's key words. A short key word ("SI", "7") must stand as a whole word, so "basic" doesn't count as "SI". When a key word is missing he compares with the model answer and marks it himself.
- **Matching and multiple choice.** Both run both ways (term from definition, definition from term), and the facts are true-or-false questions.
- **The cards drill** is the plan's routine: every one of the 13 cards right twice in a row. A missed card returns three cards later.

**Unit 4, as built.**

- Boxes, cylinders and L-shaped blocks are drawn to their numbers, and each question is worked in steps: r first, then V, then liters. Each step is marked on its own.
- The plan's slips are named where they happen: the diameter used as the radius, a radius not squared, liters multiplied instead of divided, inches left unconverted, the box around an L, and a percent difference divided by the wrong volume.
- Answers from π are accepted to a sensible rounding and shown rounded ("about 417.4 cm³").

**Endless practice (built).** A "Share link" button makes a link (`…/#practice=rates,two-step`) that opens practice straight on the chosen ideas. He chooses ideas and questions keep coming, weighted toward the weakest and most overdue ideas. It never repeats the maker just used, a miss comes back three questions later, and only generators take part.

## Open questions (for the teacher)

The site uses safe defaults until these are answered:

- Scientific notation: converting only, or also multiplying and dividing? *Default: converting only.*
- Will the "optional" factors (1,609 m = 1 mi, 3.785 L = 1 gal) be given? *Default: practise as if they must be memorised.*
- Vocabulary quizzes: matching or written definitions? *Default: both.*
- Chapter 8 Test format, and is a formula sheet allowed? *Default: worked problems with no sheet, the harder case.*

## Status

Units 1–4 and endless practice are built. Unit 5 is shown on the plan with its session date, and will be added before it.
