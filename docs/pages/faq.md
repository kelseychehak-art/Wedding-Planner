# Page Spec — FAQ (Frequently Asked Questions)

Route `/faq`. Uses the shared [content-page frame](../content-page-frame.md). Hero title **"Frequently
Asked Questions"**; subtitle "Find answers to common questions about our wedding weekend in Italy."
Body = a left **Browse by Topic** sidebar + right **category-grouped Q&A**.

> Copy: **June 16 – 21, 2027**. The "which room am I in?" answer ties to the **deferred** guest system.

## Layout (two-column, sidebar left)

### Left sidebar
1. **BROWSE BY TOPIC** — vertical list of categories (icon + label + chevron), each an in-page anchor
   to its Q&A group:
   Wedding Weekend (calendar) · Travel & Transportation (airplane) · Stay & Accommodations (bed) ·
   Activities & Experiences (bicycle) · Food & Drinks (wine) · Attire (dress) · Health & Safety
   (shield) · Gifts (gift) · Other (question mark).
2. **STILL HAVE QUESTIONS?** — **blue wavy-border box** (`ScallopFrame color="var(--color-sky-blue)"`):
   red heart, "We're here to help! Reach out if you need anything." **"CONTACT US →"** button
   (`.btn-outline`) + branch illustration.

### Right: category-grouped accordions
Each group = an uppercase category heading (with its icon at right) + a stack of expandable Q&A rows
(question + chevron). Groups/questions from the mockup:
- **WEDDING WEEKEND** (calendar): What are the dates of the wedding weekend? · Where is the wedding
  taking place? · What will the weather be like? · Is there a wedding website app?
- **TRAVEL & TRANSPORTATION** (airplane): Which airports should I fly into? · Do you recommend
  renting a car? · Will transportation be provided during the weekend? · How do I get to the villa
  from the airport?
- **STAY & ACCOMMODATIONS** (bed): Where will we be staying? · **How do I find out which room I'm
  in?** ⚠️ (answer references the deferred guest system) · What amenities are available at the villa?
  · Can I arrive early or stay later?
- (Additional categories from the sidebar — Activities, Food & Drinks, Attire, Health & Safety,
  Gifts, Other — get their own groups; populate questions when provided.)

Answer copy must use **June 16 – 21, 2027** and **Tuscany, Italy** (dates/where questions).

### Bottom
Info banner (info icon, sand/grey): "More questions? Check back often! We'll continue to add answers
as details are finalized." + bicycle illustration. Then the shared footer band.

## Reuse vs. build
- **Extend `FaqAccordion`** (`components/FaqAccordion.tsx`, `type FaqItem = { question, answer }`) to
  support **category groups + anchor ids** so the sidebar can jump to a group and each group renders
  its own single-open accordion. Keep it keyboard-accessible.
- Reuse **`ScallopFrame`** for the "Still Have Questions?" box, `Illustration` for the category +
  banner icons (add `bed`/`dress`/`shield`/`gift`/`question` or map), `.callout` for the info banner,
  and the shared frame.
- FAQ content stays **co-located** as a `const` grouped array in `app/faq/page.tsx`.

## Public vs. personalized
- **Public/static:** the entire FAQ.
- **Deferred:** the *answer* to "How do I find out which room I'm in?" points to the future guest
  portal — write it as "you'll be able to see your room here once you log in" (or similar) until then.
