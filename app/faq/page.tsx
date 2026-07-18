import type { Metadata } from "next";
import ContentPageFrame from "@/components/ContentPageFrame";
import FaqGroups, { type FaqGroup } from "@/components/FaqGroups";
import ScallopFrame from "@/components/ScallopFrame";
import Illustration from "@/components/Illustration";
import UiIcon from "@/components/UiIcon";
import styles from "./faq.module.css";

export const metadata: Metadata = {
  title: "FAQ · Kelsey & Andrew's Wedding Week",
  description: "Answers to common questions about Kelsey & Andrew's wedding week in Tuscany, Italy.",
};

const GROUPS: FaqGroup[] = [
  {
    id: "wedding-weekend",
    label: "Wedding Weekend",
    icon: { kind: "ui", name: "calendar" },
    items: [
      {
        q: "What are the dates of the wedding weekend?",
        a: (
          <p>
            Our wedding week runs <strong>Monday, June 16 through Saturday, June 21, 2027</strong>.
            Welcome events begin the afternoon of June 16, and the farewell party is the evening of
            June 21.
          </p>
        ),
      },
      {
        q: "Where is the wedding taking place?",
        a: (
          <p>
            We&rsquo;re gathering at a private villa in <strong>Tuscany, Italy</strong>. The exact
            venue is being finalized now &mdash; we&rsquo;ll share it here and by email as soon as
            it&rsquo;s confirmed.
          </p>
        ),
      },
      {
        q: "What will the weather be like?",
        a: (
          <p>
            Late June in Tuscany is typically warm and sunny, with hot afternoons and pleasant,
            cooler evenings. Pack light layers for after sunset, plus sunglasses and something for
            the pool.
          </p>
        ),
      },
      {
        q: "Is there a wedding website or app?",
        a: (
          <p>
            This website is home base for everything. Bookmark it and check back &mdash; we&rsquo;ll
            keep adding details as they&rsquo;re confirmed.
          </p>
        ),
      },
    ],
  },
  {
    id: "travel",
    label: "Travel & Transportation",
    icon: { kind: "art", name: "airplane" },
    items: [
      {
        q: "Which airports should I fly into?",
        a: (
          <p>
            We recommend Florence (FLR), Pisa (PSA), or Rome (ROM). Florence is the closest and most
            convenient to the villa. More on the <a href="/travel">Travel</a> page.
          </p>
        ),
      },
      {
        q: "Do you recommend renting a car?",
        a: (
          <p>
            We&rsquo;re planning group transfers around the main events, so a car isn&rsquo;t
            required &mdash; but renting one is a lovely way to explore the countryside on your own
            time.
          </p>
        ),
      },
      {
        q: "Will transportation be provided during the weekend?",
        a: (
          <p>
            Yes &mdash; we&rsquo;ll arrange group transfers around the main events. Details will
            land on the <a href="/travel">Travel</a> page once the venue is confirmed.
          </p>
        ),
      },
      {
        q: "How do I get to the villa from the airport?",
        a: (
          <p>
            You can pre-book a private transfer, rent a car, or take a scenic train to a nearby town.
            We&rsquo;ll share specific routes and timing on the <a href="/travel">Travel</a> page.
          </p>
        ),
      },
    ],
  },
  {
    id: "stay",
    label: "Stay & Accommodations",
    icon: { kind: "ui", name: "bed" },
    items: [
      {
        q: "Where will we be staying?",
        a: (
          <p>
            We have exclusive use of a private villa in Tuscany for the week. Room categories and
            details are on the <a href="/stay">Stay</a> page.
          </p>
        ),
      },
      {
        q: "How do I find out which room I'm in?",
        a: (
          <p>
            Room assignments are still being finalized. Once they&rsquo;re set, you&rsquo;ll be able
            to see your room right here on the site &mdash; we&rsquo;ll let you know as soon as
            that&rsquo;s ready.
          </p>
        ),
      },
      {
        q: "What amenities are available at the villa?",
        a: (
          <p>
            Expect a pool, gardens, terraces, and multiple gathering spaces &mdash; plenty of room
            to relax between events. See the <a href="/stay">Stay</a> page for the full list.
          </p>
        ),
      },
      {
        q: "Can I arrive early or stay later?",
        a: (
          <p>
            Check-in is Monday, June 16 after 3:00 PM and check-out is Saturday, June 21 by 11:00 AM.
            If you&rsquo;d like to extend your stay, just reach out and we&rsquo;ll help.
          </p>
        ),
      },
    ],
  },
  {
    id: "activities",
    label: "Activities & Experiences",
    icon: { kind: "art", name: "bicycle" },
    items: [
      {
        q: "What activities are planned?",
        a: (
          <p>
            We&rsquo;ve planned something for each day &mdash; a welcome dinner, wine tasting,
            cooking class, pool day, town excursion, and farewell party. See them all on the{" "}
            <a href="/activities">Activities</a> and <a href="/our-weekend">Our Weekend</a> pages.
          </p>
        ),
      },
      {
        q: "Do I have to attend everything?",
        a: (
          <p>
            Not at all! Join whatever you&rsquo;d like. A few events ask you to sign up so we can
            plan headcounts; the rest are come-as-you-please.
          </p>
        ),
      },
    ],
  },
  {
    id: "food",
    label: "Food & Drinks",
    icon: { kind: "art", name: "wineGlass" },
    items: [
      {
        q: "Will meals be provided?",
        a: (
          <p>
            Yes &mdash; from the welcome dinner through the farewell party, meals are part of the
            week. The <a href="/our-weekend">Our Weekend</a> schedule has the details.
          </p>
        ),
      },
      {
        q: "Can you accommodate dietary restrictions?",
        a: (
          <p>
            Absolutely. Let us know your restrictions or allergies when you{" "}
            <a href="/rsvp">RSVP</a> and we&rsquo;ll plan accordingly.
          </p>
        ),
      },
    ],
  },
  {
    id: "attire",
    label: "Attire",
    icon: { kind: "ui", name: "attire" },
    items: [
      {
        q: "What should I wear?",
        a: (
          <p>
            Think elevated and comfortable, with the Italian countryside in mind. A specific dress
            code for each event will come with your invitation and the schedule.
          </p>
        ),
      },
      {
        q: "Any tips on footwear?",
        a: (
          <p>
            Expect stone paths and grass underfoot &mdash; choose shoes you can comfortably enjoy the
            evening in.
          </p>
        ),
      },
    ],
  },
  {
    id: "health",
    label: "Health & Safety",
    icon: { kind: "ui", name: "shield" },
    items: [
      {
        q: "Do I need travel insurance?",
        a: <p>We recommend it for international travel &mdash; it&rsquo;s peace of mind worth having.</p>,
      },
      {
        q: "Anything I should pack for health & safety?",
        a: (
          <p>
            Keep any medications in your carry-on, bring sun protection, and know there are
            pharmacies in the nearby towns for anything you forget.
          </p>
        ),
      },
    ],
  },
  {
    id: "gifts",
    label: "Gifts",
    icon: { kind: "ui", name: "gift" },
    items: [
      {
        q: "Are you registering for gifts?",
        a: (
          <p>
            Your presence in Italy truly is the greatest gift &mdash; traveling to celebrate with us
            means the world. We aren&rsquo;t registering for gifts.
          </p>
        ),
      },
    ],
  },
  {
    id: "other",
    label: "Other",
    icon: { kind: "ui", name: "info" },
    items: [
      {
        q: "I have another question — who do I ask?",
        a: (
          <p>
            Please reach out to either of us directly &mdash; we&rsquo;re happy to help with anything
            at all. We&rsquo;ll also keep this page updated as more details come together.
          </p>
        ),
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <ContentPageFrame
      title="Frequently Asked Questions"
      subtitle="Find answers to common questions about our wedding weekend in Italy."
      footerLine="We can't wait to celebrate with you!"
    >
      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <nav aria-label="FAQ topics">
            <p className={styles.topicsLabel}>Browse by Topic</p>
            <div className={styles.topics}>
              {GROUPS.map((g) => (
                <a key={g.id} href={`#${g.id}`} className={styles.topic}>
                  <span className={styles.topicIcon}>
                    {g.icon.kind === "ui" ? (
                      <UiIcon name={g.icon.name} size={16} />
                    ) : (
                      <Illustration name={g.icon.name} size={16} />
                    )}
                  </span>
                  {g.label}
                  <UiIcon name="chevron" size={14} className={styles.topicChevron} />
                </a>
              ))}
            </div>
          </nav>

          <div className={styles.contact}>
            <ScallopFrame color="var(--color-sky-blue)" />
            <Illustration name="heart" tone="terracotta" size={22} />
            <h2 className={styles.contactHeading}>Still Have Questions?</h2>
            <p className={styles.contactBody}>
              We&rsquo;re here to help! Reach out if you need anything.
            </p>
            <a href="#other" className="btn-outline">
              Contact Us →
            </a>
          </div>
        </aside>

        {/* Grouped Q&A — scrolls independently of the page */}
        <div className={styles.main}>
          <div className={styles.scrollBox}>
            <FaqGroups groups={GROUPS} />
          </div>

          <div className={styles.banner}>
            <span className={styles.bannerBody}>
              <UiIcon name="info" size={20} className={styles.bannerIcon} />
              <span className={styles.bannerText}>
                More questions? Check back often! We&rsquo;ll continue to add answers as details are
                finalized.
              </span>
            </span>
            <Illustration name="bicycle" size={48} />
          </div>
        </div>
      </div>
    </ContentPageFrame>
  );
}
