import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import Illustration, { type IllustrationName } from "@/components/Illustration";
import PostageStamp from "@/components/PostageStamp";
import styles from "@/components/ContentPage.module.css";

export const metadata: Metadata = {
  title: "Things to Do · Kelsey & Andrew's Wedding Week",
  description: "What to do in Italy during Kelsey & Andrew's wedding week — food, wine, exploring, and relaxing.",
};

const IDEAS: { icon: IllustrationName; title: string; body: string }[] = [
  {
    icon: "wineGlass",
    title: "Food & Wine",
    body: "This is Italy — come hungry. Linger over long lunches, seek out a local trattoria, and taste your way through the regional wines. We'll share a few of our favorite spots as we discover them.",
  },
  {
    icon: "bicycle",
    title: "Explore the Countryside",
    body: "Wander medieval hill towns, browse a morning market, or simply take a slow drive past olive groves and vineyards. Half the joy is getting delightfully lost.",
  },
  {
    icon: "espresso",
    title: "Slow Down & Relax",
    body: "You don't have to fill every hour. Poolside afternoons, an aperitivo at golden hour, and unhurried mornings are very much part of the plan.",
  },
  {
    icon: "arch",
    title: "History & Art",
    body: "From centuries-old churches to world-class museums, Italy rewards the curious. If you're extending your trip, a day in a nearby city is well worth the detour.",
  },
];

export default function ThingsToDoPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="While You're Here"
          title="Things to Do"
          intro="Beyond the celebration, there's a whole region waiting to be explored. Here's a little inspiration for filling the hours between festivities."
          illustration={<PostageStamp variant="bicycle" size={128} rotate={-4} />}
        />

        <div className={`page-shell ${styles.page}`}>
          <section className={styles.section}>
            <p className={styles.sectionEyebrow}>A Few Ideas</p>
            <h2 className={styles.sectionTitle}>Ways to Spend the Days</h2>
            <div className={styles.grid}>
              {IDEAS.map((item) => (
                <div className={styles.card} key={item.title}>
                  <Illustration name={item.icon} size={38} className={styles.cardIcon} />
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardBody}>{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <p className={styles.sectionEyebrow}>Our Picks</p>
            <h2 className={styles.sectionTitle}>
              Local Favorites
              <span className={styles.tbd}>Coming Soon</span>
            </h2>
            <div className={styles.prose}>
              <p>
                Once our venue is set, we'll put together a proper guide to the area — the
                restaurants we love, the best nearby towns for a day trip, markets worth
                waking up early for, and any excursions you can book ahead of time.
              </p>
            </div>

            <div className={styles.callout}>
              <span className={styles.calloutIcon}>✦</span>
              <p className={styles.calloutBody}>
                <strong>A curated local guide is on its way.</strong> We're still scouting
                the perfect spot, and once we do, this page will fill up with hand-picked
                recommendations tailored to exactly where we'll be. Stay tuned.
              </p>
            </div>
          </section>

          <div className={styles.ctaBand}>
            <span className={styles.ctaText}>Come make memories with us.</span>
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
