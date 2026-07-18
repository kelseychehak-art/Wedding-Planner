import type { Metadata } from "next";
import ContentPageFrame from "@/components/ContentPageFrame";
import FaqAccordion, { type FaqItem } from "@/components/FaqAccordion";
import ScallopFrame from "@/components/ScallopFrame";
import Illustration from "@/components/Illustration";
import styles from "./faq.module.css";

export const metadata: Metadata = {
  title: "FAQ · Kelsey & Andrew's Wedding Week",
  description: "Answers to common questions about Kelsey & Andrew's wedding week in Italy.",
};

const FAQS: FaqItem[] = [
  {
    question: "When and where is the wedding?",
    answer: (
      <p>
        We&rsquo;re celebrating over a week in Italy &mdash; <strong>June 16 &ndash; 21, 2027</strong>{" "}
        &mdash; at a private villa in Tuscany. Our exact venue is being finalized now; as soon as
        it&rsquo;s confirmed, you&rsquo;ll find every detail on the <a href="/travel">Travel</a> and{" "}
        <a href="/stay">Stay</a> pages, and we&rsquo;ll email you directly.
      </p>
    ),
  },
  {
    question: "How do I RSVP?",
    answer: (
      <p>
        You can <a href="/rsvp">RSVP right here on the site</a> &mdash; just look up your
        invitation with your name and email. If you&rsquo;re having any trouble finding your
        party or need to make a change, reach out to us and we&rsquo;ll take care of it.
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
        Your invitation will list exactly who&rsquo;s included in your party &mdash; that&rsquo;s the
        best place to check. Because we&rsquo;re hosting an intimate celebration with a limited
        headcount, we&rsquo;re generally keeping the guest list to those named on the
        invitation. If you have questions about your party, just ask us directly.
      </p>
    ),
  },
  {
    question: "What about gifts?",
    answer: (
      <p>
        Your presence in Italy truly is the greatest gift &mdash; we know traveling to
        celebrate with us is no small thing, and it means the world. We aren&rsquo;t
        registering for gifts.
      </p>
    ),
  },
  {
    question: "What's the weather like?",
    answer: (
      <p>
        Late spring in Italy is usually warm and sunny, with pleasant days and cooler
        evenings. Pack layers for after sunset, and don&rsquo;t forget sunglasses and something
        for the pool.
      </p>
    ),
  },
  {
    question: "Do I need a passport or visa?",
    answer: (
      <p>
        Yes to a passport &mdash; it should be valid for at least six months beyond your travel
        dates. U.S. citizens don&rsquo;t need a visa for stays under 90 days. If you&rsquo;re
        traveling from elsewhere, check your own country&rsquo;s entry requirements. More on the{" "}
        <a href="/travel">Travel</a> page.
      </p>
    ),
  },
  {
    question: "Should I rent a car? What about getting around?",
    answer: (
      <p>
        We&rsquo;re planning group transfers around the main events, so you won&rsquo;t strictly need
        a car. That said, renting one is a wonderful way to explore the countryside on
        your own time. We&rsquo;ll share transport details on the <a href="/travel">Travel</a>{" "}
        page once the venue is confirmed.
      </p>
    ),
  },
  {
    question: "What currency is used, and will I need cash?",
    answer: (
      <p>
        Italy uses the euro (&euro;). Cards are widely accepted, but it&rsquo;s handy to carry a
        little cash for smaller shops, markets, and tips.
      </p>
    ),
  },
  {
    question: "How do I find out which room I'm in?",
    answer: (
      <p>
        Room assignments are still being finalized. Once they&rsquo;re set, you&rsquo;ll be able to
        see your room right here on the site &mdash; we&rsquo;ll let you know as soon as that&rsquo;s
        ready. In the meantime, see the <a href="/stay">Stay</a> page for the villa details.
      </p>
    ),
  },
  {
    question: "I have another question — who do I ask?",
    answer: (
      <p>
        Please don&rsquo;t hesitate to reach out to either of us directly &mdash; we&rsquo;re happy to
        help with anything at all. We&rsquo;ll also keep this page updated as more details come
        together.
      </p>
    ),
  },
];

export default function FaqPage() {
  return (
    <ContentPageFrame
      title="Frequently Asked Questions"
      subtitle="Find answers to common questions about our wedding weekend in Italy."
      heroIllustration="lemon"
      footerLine="We can't wait to share this week with you!"
    >
      <div className={styles.body}>
        <div className={styles.accordionWrap}>
          <FaqAccordion items={FAQS} />
        </div>

        <div className={styles.contact}>
          <ScallopFrame color="var(--color-sky-blue)" />
          <div className={styles.contactInner}>
            <Illustration name="heart" tone="terracotta" size={26} />
            <h2 className={styles.contactHeading}>Still Have Questions?</h2>
            <p className={styles.contactBody}>
              We&rsquo;re here to help! Reach out any time and we&rsquo;ll get you an answer.
            </p>
            <a href="/rsvp" className="btn-outline">
              RSVP Now
            </a>
          </div>
        </div>
      </div>
    </ContentPageFrame>
  );
}
