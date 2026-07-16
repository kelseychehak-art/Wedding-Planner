import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import FaqAccordion, { type FaqItem } from "@/components/FaqAccordion";
import styles from "@/components/ContentPage.module.css";

export const metadata: Metadata = {
  title: "FAQ · Kelsey & Andrew's Wedding Week",
  description: "Answers to common questions about Kelsey & Andrew's wedding week in Italy.",
};

const FAQS: FaqItem[] = [
  {
    question: "When and where is the wedding?",
    answer: (
      <p>
        We're celebrating over four days in the spring of 2027 at a private villa in
        Italy. Our exact dates and venue are being finalized now — as soon as they're
        confirmed, you'll find every detail on the{" "}
        <a href="/travel">Travel</a> and <a href="/stay">Stay</a> pages, and we'll email
        you directly.
      </p>
    ),
  },
  {
    question: "How do I RSVP?",
    answer: (
      <p>
        You can <a href="/#rsvp">RSVP right here on the site</a> — just look up your
        invitation with your name and email. If you're having any trouble finding your
        party or need to make a change, reach out to us and we'll take care of it.
      </p>
    ),
  },
  {
    question: "What should I wear?",
    answer: (
      <>
        <p>
          Think elevated and comfortable, with the Italian countryside in mind. Expect
          outdoor spaces, stone paths, and grass underfoot, so choose shoes you can
          actually enjoy the evening in.
        </p>
        <p>
          A specific dress code for each event will be included with your invitation and
          on the schedule closer to the date.
        </p>
      </>
    ),
  },
  {
    question: "Can I bring a plus-one or my kids?",
    answer: (
      <p>
        Your invitation will list exactly who's included in your party — that's the best
        place to check. Because we're hosting an intimate celebration with a limited
        headcount, we're generally keeping the guest list to those named on the
        invitation. If you have questions about your party, just ask us directly.
      </p>
    ),
  },
  {
    question: "What about gifts?",
    answer: (
      <p>
        Your presence in Italy truly is the greatest gift — we know traveling to
        celebrate with us is no small thing, and it means the world. We aren't
        registering for gifts.
      </p>
    ),
  },
  {
    question: "What's the weather like?",
    answer: (
      <p>
        Late spring in Italy is usually warm and sunny, with pleasant days and cooler
        evenings. Pack layers for after sunset, and don't forget sunglasses and something
        for the pool.
      </p>
    ),
  },
  {
    question: "Do I need a passport or visa?",
    answer: (
      <p>
        Yes to a passport — it should be valid for at least six months beyond your travel
        dates. U.S. citizens don't need a visa for stays under 90 days. If you're
        traveling from elsewhere, check your own country's entry requirements. More on the{" "}
        <a href="/travel">Travel</a> page.
      </p>
    ),
  },
  {
    question: "Should I rent a car? What about getting around?",
    answer: (
      <p>
        We're planning group transfers around the main events, so you won't strictly need
        a car. That said, renting one is a wonderful way to explore the countryside on
        your own time. We'll share transport details on the <a href="/travel">Travel</a>{" "}
        page once the venue is confirmed.
      </p>
    ),
  },
  {
    question: "What currency is used, and will I need cash?",
    answer: (
      <p>
        Italy uses the euro (€). Cards are widely accepted, but it's handy to carry a
        little cash for smaller shops, markets, and tips.
      </p>
    ),
  },
  {
    question: "I have another question — who do I ask?",
    answer: (
      <p>
        Please don't hesitate to reach out to either of us directly — we're happy to
        help with anything at all. We'll also keep this page updated as more details come
        together.
      </p>
    ),
  },
];

export default function FaqPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Good to Know"
          title="FAQ"
          intro="A few answers to the questions we hear most. If something isn't covered here, just reach out — we're always happy to help."
          illustration="/assets/illustrations/lemon-sprig.svg"
        />

        <div className={`page-shell ${styles.page}`}>
          <section className={styles.section}>
            <FaqAccordion items={FAQS} />
          </section>

          <div className={styles.ctaBand}>
            <span className={styles.ctaText}>All set? We can&rsquo;t wait to see you.</span>
            <a href="/#rsvp" className="btn-primary">
              RSVP
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
