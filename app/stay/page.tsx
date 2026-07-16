import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import styles from "@/components/ContentPage.module.css";

export const metadata: Metadata = {
  title: "Stay · Kelsey & Andrew's Wedding Week",
  description: "Where to stay for Kelsey & Andrew's wedding week in Italy — villa details, lodging, and booking.",
};

const HIGHLIGHTS = [
  {
    icon: "/assets/illustrations/room-key.svg",
    title: "One Place, Together",
    body: "We're taking over an entire villa estate so we can spend the whole week under one roof. Most guests will stay right on the property, steps from the pool, the gardens, and every celebration.",
  },
  {
    icon: "/assets/illustrations/lemon-branch.svg",
    title: "A Home for the Week",
    body: "Think long lunches on the terrace, morning coffee with a view, and evenings that drift late into the night. This is less a hotel stay and more a shared house full of the people we love.",
  },
  {
    icon: "/assets/illustrations/wine-glass.svg",
    title: "Room Blocks & Overflow",
    body: "For guests who prefer their own space, or if rooms fill up, we'll recommend a handful of charming nearby stays with easy access to the villa.",
  },
];

export default function StayPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Where You'll Stay"
          title="Stay"
          intro="We've chosen a place worth settling into — a private Italian estate where we can all be together for the whole week. Here's what to expect."
          illustration="/assets/illustrations/room-key.svg"
        />

        <div className={`page-shell ${styles.page}`}>
          <section className={styles.section}>
            <p className={styles.sectionEyebrow}>The Villa</p>
            <h2 className={styles.sectionTitle}>
              A Villa Buyout
              <span className={styles.tbd}>Venue TBD</span>
            </h2>
            <div className={styles.grid}>
              {HIGHLIGHTS.map((item) => (
                <div className={styles.card} key={item.title}>
                  <img src={item.icon} alt="" className={styles.cardIcon} />
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardBody}>{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <p className={styles.sectionEyebrow}>Booking Your Room</p>
            <h2 className={styles.sectionTitle}>How Lodging Works</h2>
            <div className={styles.prose}>
              <p>
                Room assignments at the villa are handled directly with us, and lodging is
                booked and paid separately from the wedding — much like reserving a hotel
                room for any trip. We'll reach out with room options and pricing once
                everything is confirmed.
              </p>
              <p>
                Rooms vary in size and style, and we'll do our best to match everyone with
                a comfortable spot. If you have specific needs — accessibility, traveling
                with little ones, or anything else — just let us know and we'll sort it out
                together.
              </p>
            </div>

            <div className={styles.callout}>
              <span className={styles.calloutIcon}>✦</span>
              <p className={styles.calloutBody}>
                <strong>Room details are coming soon.</strong> Once we finalize our venue,
                this page will include the villa name and location, room options and rates,
                photos, and exactly how to reserve your spot. We'll email you directly so
                nothing slips through the cracks.
              </p>
            </div>
          </section>

          <div className={styles.ctaBand}>
            <span className={styles.ctaText}>Let us know you're coming.</span>
            <a href="/rsvp" className="btn-primary">
              RSVP
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
