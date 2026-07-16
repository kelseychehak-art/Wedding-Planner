import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import styles from "@/components/ContentPage.module.css";

export const metadata: Metadata = {
  title: "Travel · Kelsey & Andrew's Wedding Week",
  description: "How to get to Italy for Kelsey & Andrew's wedding week — airports, flights, and getting to the villa.",
};

const AIRPORTS = [
  {
    icon: "/assets/illustrations/airplane.svg",
    title: "Flying Into Italy",
    body: "Most guests will fly into a major Italian hub and connect onward. Rome (FCO), Milan (MXP), and Florence (FLR) all have direct or one-stop service from the U.S. We'll confirm the closest airport once our venue is set.",
  },
  {
    icon: "/assets/illustrations/postage-stamp.svg",
    title: "Passports & Entry",
    body: "You'll need a passport valid for at least six months beyond your travel dates. U.S. citizens don't need a visa for stays under 90 days. Double-check your own country's requirements before you book.",
  },
  {
    icon: "/assets/illustrations/lemon-sprig.svg",
    title: "Getting to the Villa",
    body: "We're planning group transfers from the nearest airport or town on arrival day. Renting a car is a lovely way to explore the countryside if you'd like to venture out on your own.",
  },
];

export default function TravelPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Getting Here"
          title="Travel"
          intro="We're gathering in Italy for a few unforgettable days, and we'd love to help make the journey easy. Here's everything you'll need to start planning your trip."
          illustration="/assets/illustrations/airplane.svg"
        />

        <div className={`page-shell ${styles.page}`}>
          <section className={styles.section}>
            <p className={styles.sectionEyebrow}>The Essentials</p>
            <h2 className={styles.sectionTitle}>Planning Your Journey</h2>
            <div className={styles.grid}>
              {AIRPORTS.map((item) => (
                <div className={styles.card} key={item.title}>
                  <img src={item.icon} alt="" className={styles.cardIcon} />
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardBody}>{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <p className={styles.sectionEyebrow}>Good to Know</p>
            <h2 className={styles.sectionTitle}>
              When to Arrive
              <span className={styles.tbd}>Dates TBD</span>
            </h2>
            <div className={styles.prose}>
              <p>
                Our celebration spans four nights in the spring of 2027. We recommend
                arriving at least a day before the festivities begin to settle in, shake
                off any jet lag, and start soaking up the Italian sun.
              </p>
              <p>
                Italy is beautiful for a longer stay, so many guests may want to build a
                few extra days into their trip on either end. Once we've locked in our
                exact dates and venue, we'll share firm arrival and departure guidance
                here.
              </p>
            </div>

            <div className={styles.callout}>
              <span className={styles.calloutIcon}>✦</span>
              <p className={styles.calloutBody}>
                <strong>More details are on the way.</strong> Airport transfers, driving
                directions, and a recommended arrival window will be confirmed here as
                soon as our venue is booked. Check back closer to the date — and hold off
                on non-refundable flights until we share final dates.
              </p>
            </div>
          </section>

          <div className={styles.ctaBand}>
            <span className={styles.ctaText}>Ready to celebrate with us?</span>
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
